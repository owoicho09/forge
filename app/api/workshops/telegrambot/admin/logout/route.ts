import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, resolveAdminRedirect } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null)
  const response = NextResponse.redirect(new URL(resolveAdminRedirect(formData?.get('next')), request.url), 303)
  response.cookies.delete(ADMIN_SESSION_COOKIE)
  return response
}
