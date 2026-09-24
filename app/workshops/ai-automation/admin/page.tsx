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

type Registration = {
  id: string
  name: string
  email: string
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

// Filters available in the admin view: query param -> column + options.
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

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select(
      'id,name,email,persona,current_activity,industry,industry_other,business_description,source,utm_source,status,whatsapp_invite_clicked_at,created_at',
    )
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  for (const filter of FILTERS) {
    if (active[filter.param]) query = query.eq(filter.column, active[filter.param])
  }

  const { data, error: queryError } = await query
  const registrations = (data ?? []) as Registration[]
  const filterQuery = new URLSearchParams(active).toString()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-xl font-bold text-[#1a1714]">AI Automation Workshop Registrations</h1>
            <p className="text-sm text-slate-600">{registrations.length} registration(s)</p>
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

        <form method="GET" className="mt-6 flex flex-wrap items-end gap-3">
          {FILTERS.map((filter) => (
            <div key={filter.param}>
              <label htmlFor={`filter-${filter.param}`} className="block text-xs font-medium text-slate-500">
                {filter.label}
              </label>
              <select
                id={`filter-${filter.param}`}
                name={filter.param}
                defaultValue={active[filter.param] ?? ''}
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
          {queryError ? (
            <p className="p-6 text-sm text-red-700">Failed to load registrations: {queryError.message}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
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
                      <TableCell>{reg.email}</TableCell>
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
                  )
                })}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-8 text-center text-slate-500">
                      No registrations yet.
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
