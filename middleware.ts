import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Allow access to public routes
  if (
    req.nextUrl.pathname === '/' || 
    req.nextUrl.pathname.startsWith('/onboarding') ||
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/signup' ||
    req.nextUrl.pathname === '/forgot-password' ||
    req.nextUrl.pathname === '/reset-password' ||
    req.nextUrl.pathname === '/email-confirmation' ||
    req.nextUrl.pathname.startsWith('/auth')
  ) {
    return res
  }

  // Protect dashboard routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect logged-in users away from auth pages
  if (session && (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/signup' ||
    req.nextUrl.pathname.startsWith('/onboarding')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/email-confirmation',
    '/auth/:path*'
  ],
}
