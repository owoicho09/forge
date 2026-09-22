import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

const bodySchema = z.object({ registrationId: z.string().uuid() })

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid registration id.' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdminClient()
    // First-click wins: only set the timestamp if it isn't already set.
    await supabase
      .from('workshop_registrations')
      .update({ whatsapp_invite_clicked_at: new Date().toISOString() })
      .eq('id', parsed.data.registrationId)
      .is('whatsapp_invite_clicked_at', null)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to record invite click:', error)
    // Non-critical tracking failure — don't block the visitor.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
