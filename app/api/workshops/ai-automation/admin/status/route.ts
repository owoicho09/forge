import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { STATUS_OPTIONS, WORKSHOP_ID, optionValues } from '@/lib/workshops/ai-automation'

const ADMIN_PATH = '/workshops/ai-automation/admin'

const bodySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(optionValues(STATUS_OPTIONS)),
})

// Manual CRM pipeline update (e.g. marking attendance after the workshop).
export async function POST(request: NextRequest) {
  if (!(await hasValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const formData = await request.formData()
  const parsed = bodySchema.safeParse({ id: formData.get('id'), status: formData.get('status') })

  // Re-serialize to keep only plain filter params in the redirect.
  const filters = new URLSearchParams(String(formData.get('filters') ?? '')).toString()
  const redirectUrl = new URL(filters ? `${ADMIN_PATH}?${filters}` : ADMIN_PATH, request.url)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status update.' }, { status: 400 })
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase
    .from('workshop_registrations')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id)
    .eq('workshop_id', WORKSHOP_ID)

  if (error) {
    console.error('Failed to update registration status:', error)
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 })
  }

  return NextResponse.redirect(redirectUrl, 303)
}
