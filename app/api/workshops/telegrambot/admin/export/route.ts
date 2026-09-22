import { NextRequest, NextResponse } from 'next/server'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { WORKSHOP_ID } from '@/lib/workshops/telegrambot'

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: NextRequest) {
  if (!(await hasValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const interest = searchParams.get('interest')
  const experience = searchParams.get('experience')

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select('name,email,interest,experience_level,utm_source,utm_medium,utm_campaign,utm_content,whatsapp_invite_clicked_at,created_at')
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  if (interest) query = query.eq('interest', interest)
  if (experience) query = query.eq('experience_level', experience)

  const { data, error } = await query
  if (error) {
    console.error('Failed to export registrations:', error)
    return NextResponse.json({ error: 'Failed to export registrations.' }, { status: 500 })
  }

  const headers = [
    'Name',
    'Email',
    'Interest',
    'Experience level',
    'UTM source',
    'UTM medium',
    'UTM campaign',
    'UTM content',
    'WhatsApp invite clicked at',
    'Registered at',
  ]
  const rows = (data ?? []).map((row) =>
    [
      row.name,
      row.email,
      row.interest,
      row.experience_level,
      row.utm_source,
      row.utm_medium,
      row.utm_campaign,
      row.utm_content,
      row.whatsapp_invite_clicked_at,
      row.created_at,
    ]
      .map(csvEscape)
      .join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="telegrambot-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
