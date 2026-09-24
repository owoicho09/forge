import { NextRequest, NextResponse } from 'next/server'
import { aiAutomationRegistrationSchema } from '@/lib/validations/ai-automation-registration'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { WORKSHOP_ID, normalizeSource } from '@/lib/workshops/ai-automation'

// Basic in-memory per-IP rate limit, same approach as the telegrambot route.
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }

  const whatsappInviteUrl = process.env.WHATSAPP_WORKSHOP_INVITE_URL
  if (!whatsappInviteUrl) {
    console.error('WHATSAPP_WORKSHOP_INVITE_URL is not configured.')
    return NextResponse.json(
      { error: 'Registration is temporarily unavailable. Please try again later.' },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = aiAutomationRegistrationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form and try again.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const data = parsed.data
  const industry = data.industry ?? null

  // Attribution: ?source= wins, utm_source is the fallback. The raw value is
  // kept in utm_source for detail; `source` is normalized to a fixed bucket.
  const rawSource = data.source || data.utmSource
  const attribution: Record<string, string> = {}
  if (rawSource) {
    attribution.source = normalizeSource(rawSource)
    attribution.utm_source = data.utmSource || rawSource
  }
  if (data.utmMedium) attribution.utm_medium = data.utmMedium
  if (data.utmCampaign) attribution.utm_campaign = data.utmCampaign
  if (data.utmContent) attribution.utm_content = data.utmContent

  try {
    const supabase = getSupabaseAdminClient()

    // Upsert on (workshop_id, email_normalized) like the existing workshop:
    // a repeat submission updates answers instead of creating a duplicate.
    // Attribution keys are only sent when present so a retry doesn't erase
    // the original source; `status` is never sent so CRM progress is kept.
    const { data: row, error } = await supabase
      .from('workshop_registrations')
      .upsert(
        {
          workshop_id: WORKSHOP_ID,
          name: data.name,
          email: data.email,
          persona: data.persona,
          current_activity: data.currentActivity,
          industry,
          industry_other: industry === 'other' ? data.industryOther || null : null,
          business_description: data.businessDescription || null,
          ...attribution,
        },
        { onConflict: 'workshop_id,email_normalized' },
      )
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ registrationId: row.id, whatsappInviteUrl })
  } catch (error) {
    console.error('AI automation workshop registration failed:', error)
    return NextResponse.json(
      { error: 'We could not save your registration. Please try again.' },
      { status: 500 },
    )
  }
}
