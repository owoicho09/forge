import type { SupabaseClient } from '@supabase/supabase-js'
import { WORKSHOP_ID } from '@/lib/workshops/ai-automation'
import {
  ANSWER_COLUMNS,
  PRIMARY_PATH_OPTIONS,
  PRIMARY_PATH_SHORT_LABELS,
  QUALIFICATION_STATUS_OPTIONS,
  SUPPORT_CATEGORY_OPTIONS,
} from '@/lib/workshops/ai-automation-qualification'

// Server-side helpers for the AI Automation admin view and CSV export.

export type Qualification = {
  id: string
  registration_id: string
  name: string
  phone: string
  email: string | null
  match_type: string
  source: string
  support_category: string
  wants_follow_up: boolean
  status: string
  submitted_at: string
} & Record<string, string | null>

const QUALIFICATION_COLUMNS = [
  'id',
  'registration_id',
  'name',
  'phone',
  'email',
  'match_type',
  'source',
  'support_category',
  'wants_follow_up',
  'status',
  'submitted_at',
  ...ANSWER_COLUMNS,
].join(',')

/** Each lead's latest qualification, plus how many times they've submitted. */
export async function loadLatestQualifications(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('workshop_qualifications')
    .select(QUALIFICATION_COLUMNS)
    .eq('workshop_id', WORKSHOP_ID)
    .order('submitted_at', { ascending: false })

  const latest = new Map<string, Qualification>()
  const submissions = new Map<string, number>()
  for (const row of (data ?? []) as unknown as Qualification[]) {
    if (!latest.has(row.registration_id)) latest.set(row.registration_id, row)
    submissions.set(row.registration_id, (submissions.get(row.registration_id) ?? 0) + 1)
  }
  return { latest, submissions, error }
}

// Filters on the latest qualification: query param -> options.
export const QUALIFICATION_FILTERS = [
  {
    param: 'path',
    label: 'Primary path',
    options: PRIMARY_PATH_OPTIONS.map((o) => ({ value: o.value, label: PRIMARY_PATH_SHORT_LABELS[o.value] })),
  },
  {
    param: 'follow_up',
    label: 'Follow-up',
    options: [
      { value: 'yes', label: 'Wants follow-up' },
      { value: 'no', label: 'Not yet' },
    ],
  },
  { param: 'support', label: 'Support / next step', options: SUPPORT_CATEGORY_OPTIONS },
  { param: 'qualification', label: 'Qualification status', options: QUALIFICATION_STATUS_OPTIONS },
] as const

export function readQualificationFilters(get: (param: string) => unknown): Record<string, string> {
  const active: Record<string, string> = {}
  for (const filter of QUALIFICATION_FILTERS) {
    const value = get(filter.param)
    if (typeof value === 'string' && filter.options.some((o) => o.value === value)) active[filter.param] = value
  }
  return active
}

export function matchesQualificationFilters(q: Qualification | undefined, active: Record<string, string>): boolean {
  if (active.qualification && q?.status !== active.qualification) return false
  if (active.path && q?.primary_path !== active.path) return false
  if (active.support && q?.support_category !== active.support) return false
  if (active.follow_up && (!q || q.wants_follow_up !== (active.follow_up === 'yes'))) return false
  return true
}

// ---------------------------------------------------------------------------
// Possible matches: a person the survey couldn't link by email or phone may
// still be an existing registrant. Names are only a hint for manual review —
// never used to merge records.
// ---------------------------------------------------------------------------
const UNLINKED_MATCH_TYPES: readonly string[] = ['new_lead', 'returning_community', 'existing_crm_lead']

function nameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

/** Same name tokens in any order, or one full name containing the other (2+ words). */
function namesMatch(a: string, b: string): boolean {
  const ta = new Set(nameTokens(a))
  const tb = new Set(nameTokens(b))
  if (ta.size === 0 || tb.size === 0) return false
  const [small, large] = ta.size <= tb.size ? [ta, tb] : [tb, ta]
  const contained = [...small].every((t) => large.has(t))
  return contained && (small.size === large.size || small.size >= 2)
}

export function findPossibleMatches<T extends { id: string; name: string }>(
  lead: { id: string; name: string },
  qualification: Qualification,
  candidates: readonly T[],
): T[] {
  if (!UNLINKED_MATCH_TYPES.includes(qualification.match_type)) return []
  const names = [lead.name, qualification.name]
  return candidates.filter((c) => c.id !== lead.id && names.some((n) => namesMatch(n, c.name))).slice(0, 3)
}

/** Cohort-wide counts: what do these people actually need? */
export function computeDiagnostics(latest: Iterable<Qualification>) {
  const byPath = new Map<string, number>()
  const bySupport = new Map<string, number>()
  let total = 0
  let followUp = 0
  for (const q of latest) {
    total++
    if (q.wants_follow_up) followUp++
    byPath.set(q.primary_path ?? '', (byPath.get(q.primary_path ?? '') ?? 0) + 1)
    bySupport.set(q.support_category, (bySupport.get(q.support_category) ?? 0) + 1)
  }
  return {
    total,
    followUp,
    byPath: PRIMARY_PATH_OPTIONS.map((o) => ({ label: PRIMARY_PATH_SHORT_LABELS[o.value], count: byPath.get(o.value) ?? 0 })),
    bySupport: SUPPORT_CATEGORY_OPTIONS.map((o) => ({ label: o.label, count: bySupport.get(o.value) ?? 0 })),
  }
}
