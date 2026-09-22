import type { Metadata } from 'next'
import { hasValidAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { EXPERIENCE_OPTIONS, INTEREST_OPTIONS, WORKSHOP_ID } from '@/lib/workshops/telegrambot'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata: Metadata = {
  title: 'Workshop Registrations — FORGE Admin',
  robots: { index: false, follow: false },
}

type Registration = {
  id: string
  name: string
  email: string
  interest: string
  experience_level: string
  utm_source: string | null
  whatsapp_invite_clicked_at: string | null
  created_at: string
}

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
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
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

export default async function TelegramBotAdminPage({
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

  const interest = typeof params.interest === 'string' ? params.interest : ''
  const experience = typeof params.experience === 'string' ? params.experience : ''

  const supabase = getSupabaseAdminClient()
  let query = supabase
    .from('workshop_registrations')
    .select('id,name,email,interest,experience_level,utm_source,whatsapp_invite_clicked_at,created_at')
    .eq('workshop_id', WORKSHOP_ID)
    .order('created_at', { ascending: false })

  if (interest) query = query.eq('interest', interest)
  if (experience) query = query.eq('experience_level', experience)

  const { data, error: queryError } = await query
  const registrations = (data ?? []) as Registration[]

  const exportQuery = new URLSearchParams()
  if (interest) exportQuery.set('interest', interest)
  if (experience) exportQuery.set('experience', experience)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-xl font-bold text-[#1a1714]">Telegram Bot Workshop Registrations</h1>
            <p className="text-sm text-slate-600">{registrations.length} registration(s)</p>
          </div>
          <form method="POST" action="/api/workshops/telegrambot/admin/logout">
            <button type="submit" className="text-sm font-medium text-slate-500 hover:text-[#e85d26]">
              Sign out
            </button>
          </form>
        </div>

        <form method="GET" className="mt-6 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500">Interest</label>
            <select
              name="interest"
              defaultValue={interest}
              className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
            >
              <option value="">All</option>
              {INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Experience</label>
            <select
              name="experience"
              defaultValue={experience}
              className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
            >
              <option value="">All</option>
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-[#1a1714] hover:bg-slate-100"
          >
            Filter
          </button>
          <a
            href={`/api/workshops/telegrambot/admin/export?${exportQuery.toString()}`}
            className="h-9 rounded-md bg-[#e85d26] px-3 py-2 text-sm font-semibold leading-5 text-white hover:opacity-90"
          >
            Export CSV
          </a>
        </form>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {queryError ? (
            <p className="p-6 text-sm text-red-700">Failed to load registrations: {queryError.message}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Invite clicked</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell>{reg.email}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{reg.interest}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{reg.experience_level}</TableCell>
                    <TableCell>{reg.utm_source || '—'}</TableCell>
                    <TableCell>{reg.whatsapp_invite_clicked_at ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(reg.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-slate-500">
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
