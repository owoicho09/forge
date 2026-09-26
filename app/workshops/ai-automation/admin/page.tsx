import { Fragment } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
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
  FOLLOW_UP_OPTIONS,
  MATCH_TYPE_OPTIONS,
  PATH_SUMMARY,
  PRIMARY_PATH_SHORT_LABELS,
  QUALIFICATION_STATUS_OPTIONS,
  SUPPORT_CATEGORY_OPTIONS,
  answerLabel,
  columnLabel,
  getAnswerFields,
  type Answers,
  type PrimaryPath,
} from '@/lib/workshops/ai-automation-qualification'
import {
  QUALIFICATION_FILTERS,
  computeDiagnostics,
  loadLatestQualifications,
  matchesQualificationFilters,
  readQualificationFilters,
  type Qualification,
} from '@/lib/workshops/ai-automation-qualification-admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata: Metadata = {
  title: 'AI Automation Workshop Registrations — FORGE Admin',
  robots: { index: false, follow: false },
}

const ADMIN_PATH = '/workshops/ai-automation/admin'
const COLUMN_COUNT = 17

type Registration = {
  id: string
  name: string
  email: string | null
  phone: string | null
  persona: string | null
  current_activity: string | null
  industry: string | null
  industry_other: string | null
  business_description: string | null
  source: string
  utm_source: string | null
  status: string
  whatsapp_invite_clicked_at: string | null
  created_at: string
}

// Filters on the registration itself: query param -> column + options.
const FILTERS = [
  { param: 'persona', column: 'persona', label: 'Persona', options: PERSONA_OPTIONS },
  { param: 'source', column: 'source', label: 'Source', options: SOURCE_OPTIONS },
  { param: 'status', column: 'status', label: 'Status', options: STATUS_OPTIONS },
] as const

function LoginForm({ error }: { error?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="font-syne text-lg font-bold text-[#1a1714]">Admin access</h1>
        <p className="mt-1 text-sm text-slate-600">Enter the admin password to view workshop registrations.</p>

        {error === 'invalid' && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Incorrect password.
          </p>
        )}
        {error === 'config' && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Admin login is not configured. Set ADMIN_DASHBOARD_PASSWORD and ADMIN_SESSION_SECRET.
          </p>
        )}

        <form method="POST" action="/api/workshops/telegrambot/admin/login" className="mt-5 space-y-3">
          <input type="hidden" name="next" value={ADMIN_PATH} />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            aria-label="Password"
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-[#e85d26]/30"
          />
          <button
            type="submit"
            className="h-9 w-full rounded-md bg-[#1a1714] text-sm font-semibold text-white transition-colors hover:bg-[#1a1714]/90"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}

function Diagnostics({ diagnostics }: { diagnostics: ReturnType<typeof computeDiagnostics> }) {
  const groups = [
    { title: 'Primary path', rows: diagnostics.byPath },
    { title: 'Support / next step', rows: diagnostics.bySupport },
  ]
  return (
    <section aria-label="Qualification counts" className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <p className="text-slate-500">Qualified</p>
        <p className="font-syne text-2xl font-bold text-[#1a1714]">{diagnostics.total}</p>
        <p className="mt-1 text-slate-600">
          Follow-up requested: <span className="font-semibold text-[#1a1714]">{diagnostics.followUp}</span>
        </p>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="text-slate-500">{group.title}</p>
          <dl className="mt-1 space-y-0.5">
            {group.rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-slate-600">{row.label}</dt>
                <dd className="font-semibold tabular-nums text-[#1a1714]">{row.count}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  )
}

function QualificationProfile({
  qualification,
  submissions,
  filterQuery,
}: {
  qualification: Qualification
  submissions: number
  filterQuery: string
}) {
  const answers = qualification as unknown as Answers
  const path = qualification.primary_path as PrimaryPath
  const contextKeys = PATH_SUMMARY[path]?.context ?? []
  const fields = getAnswerFields(answers)
  const contextFields = fields.filter((f) => contextKeys.includes(f.key) || f.key === 'final_context')
  const answerFields = fields.filter((f) => !contextFields.includes(f))

  return (
    <details className="group">
      <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-[#e85d26]">
        Qualification profile · submitted {new Date(qualification.submitted_at).toLocaleString()} ·{' '}
        {labelFor(MATCH_TYPE_OPTIONS, qualification.match_type)}
        {submissions > 1 && ` · ${submissions} submissions (showing latest)`}
      </summary>

      <div className="mt-3 grid max-w-5xl gap-6 pb-2 lg:grid-cols-2">
        <div className="space-y-3">
          {contextFields.map((field) =>
            qualification[field.key] ? (
              <div key={field.key}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{field.crmLabel}</p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-[#1a1714]">“{qualification[field.key]}”</p>
              </div>
            ) : null,
          )}
          {contextFields.every((f) => !qualification[f.key]) && (
            <p className="text-sm text-slate-500">No written context given.</p>
          )}

          <div className="text-xs text-slate-500">
            Submitted as {qualification.name} · {qualification.phone}
            {qualification.email && ` · ${qualification.email}`}
          </div>

          <form method="POST" action="/api/workshops/ai-automation/admin/qualification-status" className="flex items-center gap-2">
            <input type="hidden" name="id" value={qualification.id} />
            <input type="hidden" name="filters" value={filterQuery} />
            <label htmlFor={`q-status-${qualification.id}`} className="text-xs font-medium text-slate-500">
              Qualification status
            </label>
            <select
              id={`q-status-${qualification.id}`}
              name="status"
              defaultValue={qualification.status}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
            >
              {QUALIFICATION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-[#1a1714] hover:bg-slate-100"
            >
              Save
            </button>
          </form>
        </div>

        <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-4 gap-y-1.5 text-sm">
          {answerFields.map((field) => (
            <Fragment key={field.key}>
              <dt className="text-slate-500">{field.crmLabel}</dt>
              <dd className="text-[#1a1714]">{answerLabel(field, qualification[field.key]) || '—'}</dd>
            </Fragment>
          ))}
          <dt className="text-slate-500">Support category</dt>
          <dd className="text-[#1a1714]">{labelFor(SUPPORT_CATEGORY_OPTIONS, qualification.support_category)}</dd>
        </dl>
      </div>
    </details>
  )
}

export default async function AiAutomationAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const authed = await hasValidAdminSession()

  if (!authed) {
    const error = typeof params.error === 'string' ? params.error : undefined
    return <LoginForm error={error} />
  }

  // Only accept filter values from the known option lists.
  const active: Record<string, string> = {}
  for (const filter of FILTERS) {
    const value = params[filter.param]
    if (typeof value === 'string' && filter.options.some((o) => o.value === value)) {
      active[filter.param] = value
    }
  }
  const activeQualification = readQualificationFilters((param) => params[param])

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select(
      'id,name,email,phone,persona,current_activity,industry,industry_other,business_description,source,utm_source,status,whatsapp_invite_clicked_at,created_at',
    )
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  for (const filter of FILTERS) {
    if (active[filter.param]) query = query.eq(filter.column, active[filter.param])
  }

  const [{ data, error: queryError }, qualifications] = await Promise.all([
    query,
    loadLatestQualifications(supabase),
  ])
  const registrations = ((data ?? []) as Registration[]).filter((reg) =>
    matchesQualificationFilters(qualifications.latest.get(reg.id), activeQualification),
  )
  const diagnostics = computeDiagnostics(qualifications.latest.values())
  const filterQuery = new URLSearchParams({ ...active, ...activeQualification }).toString()
  const loadError = queryError ?? qualifications.error

  const selectFilters = [
    ...FILTERS.map((f) => ({ param: f.param, label: f.label, options: f.options, value: active[f.param] })),
    ...QUALIFICATION_FILTERS.map((f) => ({
      param: f.param,
      label: f.label,
      options: f.options,
      value: activeQualification[f.param],
    })),
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-xl font-bold text-[#1a1714]">AI Automation Workshop Registrations</h1>
            <p className="text-sm text-slate-600">{registrations.length} lead(s)</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/workshops/telegrambot/admin" className="text-sm font-medium text-slate-500 hover:text-[#e85d26]">
              Telegram bot workshop →
            </Link>
            <form method="POST" action="/api/workshops/telegrambot/admin/logout">
              <input type="hidden" name="next" value={ADMIN_PATH} />
              <button type="submit" className="text-sm font-medium text-slate-500 hover:text-[#e85d26]">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <Diagnostics diagnostics={diagnostics} />

        <form method="GET" className="mt-6 flex flex-wrap items-end gap-3">
          {selectFilters.map((filter) => (
            <div key={filter.param}>
              <label htmlFor={`filter-${filter.param}`} className="block text-xs font-medium text-slate-500">
                {filter.label}
              </label>
              <select
                id={`filter-${filter.param}`}
                name={filter.param}
                defaultValue={filter.value ?? ''}
                className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="submit"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-[#1a1714] hover:bg-slate-100"
          >
            Filter
          </button>
          <a
            href={`/api/workshops/ai-automation/admin/export?${filterQuery}`}
            className="h-9 rounded-md bg-[#e85d26] px-3 py-2 text-sm font-semibold leading-5 text-white hover:opacity-90"
          >
            Export CSV
          </a>
        </form>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {loadError ? (
            <p className="p-6 text-sm text-red-700">Failed to load registrations: {loadError.message}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Persona</TableHead>
                  <TableHead>Working on</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Invite clicked</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Need / blocker</TableHead>
                  <TableHead>Support</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => {
                  const industry =
                    reg.industry === 'other' && reg.industry_other
                      ? `Other: ${reg.industry_other}`
                      : labelFor(INDUSTRY_OPTIONS, reg.industry)
                  const q = qualifications.latest.get(reg.id)
                  const qAnswers = q as unknown as Answers | undefined
                  const summary = q ? PATH_SUMMARY[q.primary_path as PrimaryPath] : undefined
                  const stage = qAnswers && summary ? columnLabel(qAnswers, summary.stage) : ''
                  const need = qAnswers && summary ? columnLabel(qAnswers, summary.need) : ''
                  return (
                    <Fragment key={reg.id}>
                      <TableRow className={q ? 'border-b-0' : undefined}>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell>{reg.email || '—'}</TableCell>
                        <TableCell>{reg.phone || '—'}</TableCell>
                        <TableCell>{labelFor(PERSONA_OPTIONS, reg.persona) || '—'}</TableCell>
                        <TableCell>{labelFor(ACTIVITY_OPTIONS, reg.current_activity) || '—'}</TableCell>
                        <TableCell className="max-w-[180px] truncate" title={industry}>
                          {industry || '—'}
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate" title={reg.business_description ?? ''}>
                          {reg.business_description || '—'}
                        </TableCell>
                        <TableCell title={reg.utm_source ?? ''}>{labelFor(SOURCE_OPTIONS, reg.source)}</TableCell>
                        <TableCell>{reg.whatsapp_invite_clicked_at ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{new Date(reg.created_at).toLocaleString()}</TableCell>
                        <TableCell>{q ? PRIMARY_PATH_SHORT_LABELS[q.primary_path as PrimaryPath] : '—'}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={stage}>
                          {stage || '—'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={need}>
                          {need || '—'}
                        </TableCell>
                        <TableCell>{q ? labelFor(SUPPORT_CATEGORY_OPTIONS, q.support_category) : '—'}</TableCell>
                        <TableCell title={q ? labelFor(FOLLOW_UP_OPTIONS, q.follow_up_intent) : ''}>
                          {q ? (
                            q.wants_follow_up ? (
                              <span className="font-semibold text-[#e85d26]">Yes</span>
                            ) : (
                              'Not yet'
                            )
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>{q ? labelFor(QUALIFICATION_STATUS_OPTIONS, q.status) : '—'}</TableCell>
                        <TableCell>
                          <form
                            method="POST"
                            action="/api/workshops/ai-automation/admin/status"
                            className="flex items-center gap-2"
                          >
                            <input type="hidden" name="id" value={reg.id} />
                            <input type="hidden" name="filters" value={filterQuery} />
                            <select
                              name="status"
                              defaultValue={reg.status}
                              aria-label={`Status for ${reg.name}`}
                              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="h-8 rounded-md border border-slate-200 px-2 text-xs font-medium text-[#1a1714] hover:bg-slate-100"
                            >
                              Save
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                      {q && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={COLUMN_COUNT} className="whitespace-normal pt-0">
                            <QualificationProfile
                              qualification={q}
                              submissions={qualifications.submissions.get(reg.id) ?? 1}
                              filterQuery={filterQuery}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} className="py-8 text-center text-slate-500">
                      No registrations match.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </main>
  )
}
