import { NextRequest, NextResponse } from 'next/server'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import {
  ACTIVITY_OPTIONS,
  AI_GOAL_OPTIONS,
  INDUSTRY_OPTIONS,
  PERSONA_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  WORKSHOP_ID,
  labelFor,
} from '@/lib/workshops/ai-automation'

const FILTERS = [
  { param: 'persona', column: 'persona', options: PERSONA_OPTIONS },
  { param: 'goal', column: 'ai_goal', options: AI_GOAL_OPTIONS },
  { param: 'source', column: 'source', options: SOURCE_OPTIONS },
  { param: 'status', column: 'status', options: STATUS_OPTIONS },
] as const

function csvEscape(value: unknown): string {
  let str = value === null || value === undefined ? '' : String(value)
  // Neutralize spreadsheet formula injection from free-text answers.
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: NextRequest) {
  if (!(await hasValidAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select(
      'id,name,email,persona,current_activity,industry,industry_other,business_description,ai_goal,ai_goal_other,source,utm_source,utm_medium,utm_campaign,utm_content,status,whatsapp_invite_clicked_at,created_at',
    )
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  for (const filter of FILTERS) {
    const value = searchParams.get(filter.param)
    if (value && filter.options.some((o) => o.value === value)) query = query.eq(filter.column, value)
  }

  const { data, error } = await query
  if (error) {
    console.error('Failed to export registrations:', error)
    return NextResponse.json({ error: 'Failed to export registrations.' }, { status: 500 })
  }

  const headers = [
    'Registration ID',
    'Name',
    'Email',
    'Persona',
    'Currently working on',
    'Industry',
    'Industry (other)',
    'Business description',
    'AI goal',
    'AI goal (other)',
    'Source',
    'UTM source',
    'UTM medium',
    'UTM campaign',
    'UTM content',
    'Status',
    'WhatsApp invite clicked at',
    'Registered at',
  ]
  const rows = (data ?? []).map((row) =>
    [
      row.id,
      row.name,
      row.email,
      labelFor(PERSONA_OPTIONS, row.persona),
      labelFor(ACTIVITY_OPTIONS, row.current_activity),
      labelFor(INDUSTRY_OPTIONS, row.industry),
      row.industry_other,
      row.business_description,
      labelFor(AI_GOAL_OPTIONS, row.ai_goal),
      row.ai_goal_other,
      labelFor(SOURCE_OPTIONS, row.source),
      row.utm_source,
      row.utm_medium,
      row.utm_campaign,
      row.utm_content,
      labelFor(STATUS_OPTIONS, row.status),
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
      'Content-Disposition': `attachment; filename="ai-automation-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
