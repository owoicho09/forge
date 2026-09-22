import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/workshops/telegrambot/admin', request.url), 303)
  response.cookies.delete(ADMIN_SESSION_COOKIE)
  return response
}
