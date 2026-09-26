import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { normalizePhone } from '@/lib/phone'
import { WORKSHOP_ID, normalizeSource, type Source } from '@/lib/workshops/ai-automation'
import {
  ANSWER_COLUMNS,
  deriveSupportCategory,
  validateQualification,
  wantsFollowUp,
  type MatchType,
} from '@/lib/workshops/ai-automation-qualification'

// Basic in-memory per-IP rate limit, same approach as the register route.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS
}

// A resubmission within this window (e.g. a retry after a dropped response)
// replaces the previous submission instead of adding another one.
const RESUBMIT_WINDOW_MS = 2 * 60_000

const bodySchema = z.object({
  answers: z
    .record(z.string(), z.string().max(4000))
    .refine((a) => Object.keys(a).length <= 40, 'Too many answers.'),
  source: z.string().trim().max(200).nullish(),
  utmSource: z.string().trim().max(200).nullish(),
})

type Lead = {
  id: string
  name: string
  email: string | null
  phone_normalized: string | null
  source: string
  status: string
}

const LEAD_COLUMNS = 'id,name,email,phone_normalized,source,status'

async function firstLead(query: PromiseLike<{ data: unknown; error: unknown }>): Promise<Lead | null> {
  const { data, error } = await query
  if (error) throw error
  return ((data as Lead[] | null) ?? [])[0] ?? null
}

/**
 * Finds this person's lead for the AI Automation workshop: by email, then by
 * phone on the lead, then by phone on an earlier qualification. Never by name.
 */
async function findWorkshopLead(supabase: SupabaseClient, email: string | null, phone: string): Promise<Lead | null> {
  const leads = () =>
    supabase.from('workshop_registrations').select(LEAD_COLUMNS).eq('workshop_id', WORKSHOP_ID)

  if (email) {
    const lead = await firstLead(leads().eq('email_normalized', email).order('created_at').limit(1))
    if (lead) return lead
  }

  const byPhone = await firstLead(leads().eq('phone_normalized', phone).order('created_at').limit(1))
  if (byPhone) return byPhone

  const { data, error } = await supabase
    .from('workshop_qualifications')
    .select('registration_id')
    .eq('workshop_id', WORKSHOP_ID)
    .eq('phone_normalized', phone)
    .order('submitted_at')
    .limit(1)
  if (error) throw error
  const registrationId = data?.[0]?.registration_id
  return registrationId ? firstLead(leads().eq('id', registrationId).limit(1)) : null
}

/** Finds the person in another workshop's registrations (e.g. telegrambot). */
async function findOtherWorkshopLead(
  supabase: SupabaseClient,
  email: string | null,
  phone: string,
): Promise<Lead | null> {
  const leads = () =>
    supabase.from('workshop_registrations').select(LEAD_COLUMNS).neq('workshop_id', WORKSHOP_ID)
  if (email) {
    const lead = await firstLead(leads().eq('email_normalized', email).order('created_at').limit(1))
    if (lead) return lead
  }
  return firstLead(leads().eq('phone_normalized', phone).order('created_at').limit(1))
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsedBody = bodySchema.safeParse(body)
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Please check your answers and try again.' }, { status: 400 })
  }

  const result = validateQualification(parsedBody.data.answers)
  if (!result.ok) {
    return NextResponse.json(
      { error: 'Please check your answers and try again.', fieldErrors: result.errors },
      { status: 400 },
    )
  }

  const values = result.values
  const phoneNormalized = normalizePhone(values.phone)!
  const emailNormalized = values.email?.toLowerCase() ?? null

  const rawSource = parsedBody.data.source || parsedBody.data.utmSource
  const attributedSource: Source | null = rawSource ? normalizeSource(rawSource) : null

  try {
    const supabase = getSupabaseAdminClient()

    // 1. Match the person to a lead record server-side.
    let lead = await findWorkshopLead(supabase, emailNormalized, phoneNormalized)
    let matchType: MatchType

    const { data: previous, error: previousError } = lead
      ? await supabase
          .from('workshop_qualifications')
          .select('id,match_type,submitted_at')
          .eq('registration_id', lead.id)
          .order('submitted_at', { ascending: false })
      : { data: [], error: null }
    if (previousError) throw previousError
    const previousSubmissions = (previous ?? []) as { id: string; match_type: MatchType; submitted_at: string }[]

    if (lead) {
      // Keep the classification from their first submission (a lead created
      // by an earlier qualification stays a "new lead", not a workshop lead).
      matchType = previousSubmissions.at(-1)?.match_type ?? 'existing_workshop_lead'

      // 2. Enrich without overwriting: only fill contact details that are missing.
      const updates: Record<string, string> = {}
      if (!lead.phone_normalized) {
        updates.phone = values.phone
        updates.phone_normalized = phoneNormalized
      }
      if (!lead.email && values.email) updates.email = values.email
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from('workshop_registrations').update(updates).eq('id', lead.id)
        if (error) console.error('Failed to enrich lead contact details:', error)
      }

      // Move the pipeline forward, never back from a consultation status.
      const { error: statusError } = await supabase
        .from('workshop_registrations')
        .update({ status: 'post_qualified' })
        .eq('id', lead.id)
        .in('status', ['registered', 'attended'])
      if (statusError) console.error('Failed to update lead status:', statusError)
    } else {
      // 3. Not a lead for this workshop yet: create one, noting whether we
      // know them from another workshop.
      const otherLead = await findOtherWorkshopLead(supabase, emailNormalized, phoneNormalized)
      matchType = otherLead
        ? 'existing_crm_lead'
        : attributedSource === 'community'
          ? 'returning_community'
          : 'new_lead'

      const { data: created, error: createError } = await supabase
        .from('workshop_registrations')
        .insert({
          workshop_id: WORKSHOP_ID,
          name: values.name,
          email: values.email ?? otherLead?.email ?? null,
          phone: values.phone,
          phone_normalized: phoneNormalized,
          source: attributedSource ?? (otherLead ? 'community' : 'unknown'),
          utm_source: rawSource ? parsedBody.data.utmSource || rawSource : null,
          status: 'post_qualified',
        })
        .select(LEAD_COLUMNS)
        .single()

      if (createError?.code === '23505') {
        // Created by a concurrent submission with the same email.
        lead = await findWorkshopLead(supabase, emailNormalized, phoneNormalized)
        if (!lead) throw createError
      } else if (createError) {
        throw createError
      } else {
        lead = created as Lead
      }
    }

    // 4. Save the submission. Earlier submissions are kept as history.
    const row: Record<string, unknown> = {
      registration_id: lead.id,
      workshop_id: WORKSHOP_ID,
      name: values.name,
      phone: values.phone,
      phone_normalized: phoneNormalized,
      email: values.email ?? null,
      match_type: matchType,
      source: attributedSource ?? lead.source,
      support_category: deriveSupportCategory(values),
      wants_follow_up: wantsFollowUp(values.follow_up_intent),
      submitted_at: new Date().toISOString(),
    }
    for (const column of ANSWER_COLUMNS) row[column] = values[column] ?? null

    const latest = previousSubmissions[0]
    const isRetry = latest && Date.now() - new Date(latest.submitted_at).getTime() < RESUBMIT_WINDOW_MS
    const { error: saveError } = isRetry
      ? await supabase.from('workshop_qualifications').update(row).eq('id', latest.id)
      : await supabase.from('workshop_qualifications').insert(row)
    if (saveError) throw saveError

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('AI automation qualification failed:', error)
    return NextResponse.json({ error: 'We could not save your answers. Please try again.' }, { status: 500 })
  }
}
