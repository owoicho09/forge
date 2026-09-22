import { NextRequest, NextResponse } from 'next/server'
import { workshopRegistrationSchema } from '@/lib/validations/workshop-registration'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { WORKSHOP_ID } from '@/lib/workshops/telegrambot'

// Basic in-memory per-IP rate limit. Resets on server restart — enough to
// blunt naive endpoint abuse without adding an external dependency.
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

  const parsed = workshopRegistrationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form and try again.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { name, email, interest, experienceLevel, utmSource, utmMedium, utmCampaign, utmContent } = parsed.data

  try {
    const supabase = getSupabaseAdminClient()

    // Only include UTM keys when present, so a retry/duplicate submission
    // without UTM params doesn't null out attribution captured earlier —
    // ON CONFLICT only overwrites columns present in this payload.
    const utmFields: Record<string, string> = {}
    if (utmSource) utmFields.utm_source = utmSource
    if (utmMedium) utmFields.utm_medium = utmMedium
    if (utmCampaign) utmFields.utm_campaign = utmCampaign
    if (utmContent) utmFields.utm_content = utmContent

    const { data, error } = await supabase
      .from('workshop_registrations')
      .upsert(
        {
          workshop_id: WORKSHOP_ID,
          name,
          email,
          interest,
          experience_level: experienceLevel,
          ...utmFields,
        },
        { onConflict: 'workshop_id,email_normalized' },
      )
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ registrationId: data.id, whatsappInviteUrl })
  } catch (error) {
    console.error('Workshop registration failed:', error)
    return NextResponse.json(
      { error: 'We could not save your registration. Please try again.' },
      { status: 500 },
    )
  }
}
