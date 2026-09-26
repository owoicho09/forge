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
  findPossibleMatches,
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

type View = 'registrations' | 'qualifications'

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

// Registration filters: query param -> column + options. Source applies to both views.
const REGISTRATION_FILTERS = [
  { param: 'persona', column: 'persona', label: 'Persona', options: PERSONA_OPTIONS },
  { param: 'source', column: 'source', label: 'Source', options: SOURCE_OPTIONS },
  { param: 'status', column: 'status', label: 'Status', options: STATUS_OPTIONS },
] as const
const SOURCE_FILTER = REGISTRATION_FILTERS[1]

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

function ViewToggle({ view, counts }: { view: View; counts: Record<View, number> }) {
  const views: { value: View; label: string; href: string }[] = [
    { value: 'registrations', label: 'Registrations', href: ADMIN_PATH },
    { value: 'qualifications', label: 'Post-workshop qualifications', href: `${ADMIN_PATH}?view=qualifications` },
  ]
  return (
    <nav aria-label="Admin views" className="mt-6 inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1">
      {views.map((v) => (
        <Link
          key={v.value}
          href={v.href}
          aria-current={view === v.value ? 'page' : undefined}
          className={
            view === v.value
              ? 'rounded-md bg-[#1a1714] px-3 py-1.5 text-sm font-semibold text-white'
              : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#e85d26]'
          }
        >
          {v.label} <span className="tabular-nums opacity-70">({counts[v.value]})</span>
        </Link>
      ))}
    </nav>
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

function FilterBar({
  filters,
  view,
  filterQuery,
}: {
  filters: { param: string; label: string; options: readonly { value: string; label: string }[]; value?: string }[]
  view: View
  filterQuery: string
}) {
  return (
    <form method="GET" className="mt-6 flex flex-wrap items-end gap-3">
      {view === 'qualifications' && <input type="hidden" name="view" value="qualifications" />}
      {filters.map((filter) => (
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
  )
}

function LeadStatusForm({ reg, filterQuery }: { reg: Registration; filterQuery: string }) {
  return (
    <form method="POST" action="/api/workshops/ai-automation/admin/status" className="flex items-center gap-2">
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
  const contextKeys = PATH_SUMMARY[qualification.primary_path as PrimaryPath]?.context ?? []
  const fields = getAnswerFields(answers)
  const contextFields = fields.filter((f) => contextKeys.includes(f.key))
  const answerFields = fields.filter((f) => !contextFields.includes(f))

  return (
    <details>
      <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-[#e85d26]">
        Qualification profile
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

          <form
            method="POST"
            action="/api/workshops/ai-automation/admin/qualification-status"
            className="flex items-center gap-2"
          >
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

function RegistrationsTable({ registrations, filterQuery }: { registrations: Registration[]; filterQuery: string }) {
  return (
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
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg) => {
          const industry =
            reg.industry === 'other' && reg.industry_other
              ? `Other: ${reg.industry_other}`
              : labelFor(INDUSTRY_OPTIONS, reg.industry)
          return (
            <TableRow key={reg.id}>
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
              <TableCell>
                <LeadStatusForm reg={reg} filterQuery={filterQuery} />
              </TableCell>
            </TableRow>
          )
        })}
        {registrations.length === 0 && (
          <TableRow>
            <TableCell colSpan={11} className="py-8 text-center text-slate-500">
              No registrations match.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

const QUALIFICATION_COLUMNS = 13

function QualificationsTable({
  rows,
  allRegistrations,
  submissions,
  filterQuery,
}: {
  rows: { reg: Registration; q: Qualification }[]
  allRegistrations: Registration[]
  submissions: Map<string, number>
  filterQuery: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Submitted</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Lead match</TableHead>
          <TableHead>Possible match</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Need / blocker</TableHead>
          <TableHead>Support</TableHead>
          <TableHead>Follow-up</TableHead>
          <TableHead>Qualification</TableHead>
          <TableHead>Lead status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ reg, q }) => {
          const answers = q as unknown as Answers
          const summary = PATH_SUMMARY[q.primary_path as PrimaryPath]
          const stage = summary ? columnLabel(answers, summary.stage) : ''
          const need = summary ? columnLabel(answers, summary.need) : ''
          const possible = findPossibleMatches(reg, q, allRegistrations)
          return (
            <Fragment key={reg.id}>
              <TableRow className="border-b-0">
                <TableCell>{new Date(q.submitted_at).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{q.name}</TableCell>
                <TableCell>{q.phone}</TableCell>
                <TableCell>{q.email || reg.email || '—'}</TableCell>
                <TableCell>{labelFor(MATCH_TYPE_OPTIONS, q.match_type)}</TableCell>
                <TableCell className="whitespace-normal">
                  {possible.length === 0 ? (
                    '—'
                  ) : (
                    <ul className="min-w-[200px] space-y-0.5 text-xs text-amber-800">
                      {possible.map((p) => (
                        <li key={p.id}>
                          {p.name}
                          {p.email && ` · ${p.email}`} · registered {new Date(p.created_at).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
                <TableCell>{PRIMARY_PATH_SHORT_LABELS[q.primary_path as PrimaryPath] ?? q.primary_path}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={stage}>
                  {stage || '—'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={need}>
                  {need || '—'}
                </TableCell>
                <TableCell>{labelFor(SUPPORT_CATEGORY_OPTIONS, q.support_category)}</TableCell>
                <TableCell title={labelFor(FOLLOW_UP_OPTIONS, q.follow_up_intent)}>
                  {q.wants_follow_up ? <span className="font-semibold text-[#e85d26]">Yes</span> : 'Not yet'}
                </TableCell>
                <TableCell>{labelFor(QUALIFICATION_STATUS_OPTIONS, q.status)}</TableCell>
                <TableCell>
                  <LeadStatusForm reg={reg} filterQuery={filterQuery} />
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={QUALIFICATION_COLUMNS} className="whitespace-normal pt-0">
                  <QualificationProfile
                    qualification={q}
                    submissions={submissions.get(reg.id) ?? 1}
                    filterQuery={filterQuery}
                  />
                </TableCell>
              </TableRow>
            </Fragment>
          )
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={QUALIFICATION_COLUMNS} className="py-8 text-center text-slate-500">
              No qualifications match.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
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

  const view: View = params.view === 'qualifications' ? 'qualifications' : 'registrations'

  // Only accept filter values from the known option lists.
  const registrationFilters = view === 'registrations' ? REGISTRATION_FILTERS : [SOURCE_FILTER]
  const active: Record<string, string> = {}
  for (const filter of registrationFilters) {
    const value = params[filter.param]
    if (typeof value === 'string' && filter.options.some((o) => o.value === value)) {
      active[filter.param] = value
    }
  }
  const activeQualification = view === 'qualifications' ? readQualificationFilters((param) => params[param]) : {}

  const supabase = getSupabaseAdminClient()
  const [{ data, error: queryError }, qualifications] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select(
        'id,name,email,phone,persona,current_activity,industry,industry_other,business_description,source,utm_source,status,whatsapp_invite_clicked_at,created_at',
      )
      .eq('workshop_id', WORKSHOP_ID)
      .order('created_at', { ascending: false }),
    loadLatestQualifications(supabase),
  ])
  const allRegistrations = (data ?? []) as Registration[]
  const loadError = queryError ?? qualifications.error

  const registrations = allRegistrations.filter((reg) =>
    registrationFilters.every((f) => !active[f.param] || reg[f.column] === active[f.param]),
  )
  const qualificationRows = registrations
    .flatMap((reg) => {
      const q = qualifications.latest.get(reg.id)
      return q && matchesQualificationFilters(q, activeQualification) ? [{ reg, q }] : []
    })
    .sort((a, b) => b.q.submitted_at.localeCompare(a.q.submitted_at))

  const filterQuery = new URLSearchParams({
    ...(view === 'qualifications' ? { view } : {}),
    ...active,
    ...activeQualification,
  }).toString()

  const filters = [
    ...registrationFilters.map((f) => ({ param: f.param, label: f.label, options: f.options, value: active[f.param] })),
    ...(view === 'qualifications'
      ? QUALIFICATION_FILTERS.map((f) => ({
          param: f.param,
          label: f.label,
          options: f.options,
          value: activeQualification[f.param],
        }))
      : []),
  ]

  const shown = view === 'registrations' ? registrations.length : qualificationRows.length

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-xl font-bold text-[#1a1714]">AI Automation Workshop</h1>
            <p className="text-sm text-slate-600">
              {shown} {view === 'registrations' ? 'registration(s)' : 'qualified lead(s)'} shown
            </p>
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

        <ViewToggle
          view={view}
          counts={{ registrations: allRegistrations.length, qualifications: qualifications.latest.size }}
        />

        {view === 'qualifications' && <Diagnostics diagnostics={computeDiagnostics(qualifications.latest.values())} />}

        <FilterBar filters={filters} view={view} filterQuery={filterQuery} />

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {loadError ? (
            <p className="p-6 text-sm text-red-700">Failed to load data: {loadError.message}</p>
          ) : view === 'registrations' ? (
            <RegistrationsTable registrations={registrations} filterQuery={filterQuery} />
          ) : (
            <QualificationsTable
              rows={qualificationRows}
              allRegistrations={allRegistrations}
              submissions={qualifications.submissions}
              filterQuery={filterQuery}
            />
          )}
        </div>
      </div>
    </main>
  )
}
