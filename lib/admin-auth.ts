import crypto from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_SESSION_COOKIE = 'fb_admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('Missing ADMIN_SESSION_SECRET environment variable.')
  }
  return secret
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

/** Builds a signed `expiry.signature` token to store in the session cookie. */
export function createSessionToken(): string {
  const expiry = String(Date.now() + SESSION_TTL_MS)
  return `${expiry}.${sign(expiry)}`
}

/** Verifies a session token's signature and expiry. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [expiry, signature] = token.split('.')
  if (!expiry || !signature) return false

  const expected = sign(expiry)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return false

  return Date.now() < Number(expiry)
}

/** Reads the admin session cookie (via next/headers `cookies()`) and reports whether it's valid. */
export async function hasValidAdminSession(): Promise<boolean> {
  const store = await cookies()
  return isValidSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD
  if (!expected) {
    throw new Error('Missing ADMIN_DASHBOARD_PASSWORD environment variable.')
  }
  const provided = Buffer.from(password)
  const expectedBuffer = Buffer.from(expected)
  if (provided.length !== expectedBuffer.length) return false
  return crypto.timingSafeEqual(provided, expectedBuffer)
}

// Admin pages that the shared login/logout routes may redirect back to.
const ADMIN_PAGE_PATHS = ['/workshops/telegrambot/admin', '/workshops/ai-automation/admin'] as const

/** Returns `next` if it's a known admin page, otherwise the telegrambot admin (the original default). */
export function resolveAdminRedirect(next: unknown): string {
  return ADMIN_PAGE_PATHS.find((path) => path === next) ?? ADMIN_PAGE_PATHS[0]
}
