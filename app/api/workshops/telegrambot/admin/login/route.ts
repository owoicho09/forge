import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, checkAdminPassword, createSessionToken } from '@/lib/admin-auth'

const ADMIN_PAGE_PATH = '/workshops/telegrambot/admin'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = String(formData.get('password') ?? '')

  let passwordOk = false
  try {
    passwordOk = checkAdminPassword(password)
  } catch (error) {
    console.error('Admin login misconfigured:', error)
    return NextResponse.redirect(new URL(`${ADMIN_PAGE_PATH}?error=config`, request.url), 303)
  }

  if (!passwordOk) {
    return NextResponse.redirect(new URL(`${ADMIN_PAGE_PATH}?error=invalid`, request.url), 303)
  }

  const response = NextResponse.redirect(new URL(ADMIN_PAGE_PATH, request.url), 303)
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60,
  })
  return response
}
