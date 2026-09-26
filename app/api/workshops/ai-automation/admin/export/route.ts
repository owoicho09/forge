import { NextRequest, NextResponse } from 'next/server'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import {
  ACTIVITY_OPTIONS,
  INDUSTRY_OPTIONS,
  PERSONA_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  WORKSHOP_ID,
  labelFor,
} from '@/lib/workshops/ai-automation'
import {
  ANSWER_COLUMNS,
  MATCH_TYPE_OPTIONS,
  PRIMARY_PATH_OPTIONS,
  QUALIFICATION_STATUS_OPTIONS,
  SUPPORT_CATEGORY_OPTIONS,
  answerLabel,
  getAnswerFields,
  type Answers,
  type Field,
} from '@/lib/workshops/ai-automation-qualification'
import {
  loadLatestQualifications,
  matchesQualificationFilters,
  readQualificationFilters,
} from '@/lib/workshops/ai-automation-qualification-admin'

const FILTERS = [
  { param: 'persona', column: 'persona', options: PERSONA_OPTIONS },
  { param: 'source', column: 'source', options: SOURCE_OPTIONS },
  { param: 'status', column: 'status', options: STATUS_OPTIONS },
] as const

// CSV headers for the qualification answer columns. `support_need` is asked
// differently on two paths, so it gets a neutral header.
const ANSWER_HEADERS = new Map<string, string>()
for (const path of PRIMARY_PATH_OPTIONS) {
  for (const field of getAnswerFields({ primary_path: path.value })) {
    if (!ANSWER_HEADERS.has(field.key)) ANSWER_HEADERS.set(field.key, field.crmLabel)
  }
}
ANSWER_HEADERS.set('support_need', 'Support need')

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
  // Qualifications view: only people who completed the post-workshop survey.
  const qualifiedOnly = searchParams.get('view') === 'qualifications'
  const activeQualification = readQualificationFilters((param) => searchParams.get(param))

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select(
      'id,name,email,phone,persona,current_activity,industry,industry_other,business_description,source,utm_source,utm_medium,utm_campaign,utm_content,status,whatsapp_invite_clicked_at,created_at',
    )
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  for (const filter of FILTERS) {
    const value = searchParams.get(filter.param)
    if (value && filter.options.some((o) => o.value === value)) query = query.eq(filter.column, value)
  }

  const [{ data, error }, qualifications] = await Promise.all([query, loadLatestQualifications(supabase)])
  if (error || qualifications.error) {
    console.error('Failed to export registrations:', error ?? qualifications.error)
    return NextResponse.json({ error: 'Failed to export registrations.' }, { status: 500 })
  }

  const headers = [
    'Registration ID',
    'Name',
    'Email',
    'Phone',
    'Persona',
    'Currently working on',
    'Industry',
    'Industry (other)',
    'Business description',
    'Source',
    'UTM source',
    'UTM medium',
    'UTM campaign',
    'UTM content',
    'Status',
    'WhatsApp invite clicked at',
    'Registered at',
    'Qualified at',
    'Qualification submissions',
    'Qualification status',
    'Lead match',
    'Support category',
    'Wants follow-up',
    ...ANSWER_COLUMNS.map((key) => ANSWER_HEADERS.get(key) ?? key),
  ]
  const rows = (data ?? [])
    .filter((row) => {
      const q = qualifications.latest.get(row.id)
      return (!qualifiedOnly || !!q) && matchesQualificationFilters(q, activeQualification)
    })
    .map((row) => {
      const q = qualifications.latest.get(row.id)
      const fields = new Map<string, Field>(
        q ? getAnswerFields(q as unknown as Answers).map((f) => [f.key, f]) : [],
      )
      return [
        row.id,
        row.name,
        row.email,
        row.phone,
        labelFor(PERSONA_OPTIONS, row.persona),
        labelFor(ACTIVITY_OPTIONS, row.current_activity),
        labelFor(INDUSTRY_OPTIONS, row.industry),
        row.industry_other,
        row.business_description,
        labelFor(SOURCE_OPTIONS, row.source),
        row.utm_source,
        row.utm_medium,
        row.utm_campaign,
        row.utm_content,
        labelFor(STATUS_OPTIONS, row.status),
        row.whatsapp_invite_clicked_at,
        row.created_at,
        q?.submitted_at,
        q ? qualifications.submissions.get(row.id) : '',
        labelFor(QUALIFICATION_STATUS_OPTIONS, q?.status),
        labelFor(MATCH_TYPE_OPTIONS, q?.match_type),
        labelFor(SUPPORT_CATEGORY_OPTIONS, q?.support_category),
        q ? (q.wants_follow_up ? 'Yes' : 'No') : '',
        ...ANSWER_COLUMNS.map((key) => {
          const field = fields.get(key)
          return field ? answerLabel(field, q?.[key]) : ''
        }),
      ]
        .map(csvEscape)
        .join(',')
    })
  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ai-automation-${qualifiedOnly ? 'qualifications' : 'registrations'}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
