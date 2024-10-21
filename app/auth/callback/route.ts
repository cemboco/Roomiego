import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('Auth callback route handler called')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Received code:', code)

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      console.log('Exchange code for session result:', { data, error })
      if (error) throw error
    } catch (error) {
      console.error('Error exchanging code for session:', error)
    }
  }

  // Redirect directly to the first onboarding page after email confirmation
  const redirectUrl = new URL('/onboarding/1', requestUrl.origin)
  console.log('Redirecting to:', redirectUrl.toString())
  
  return NextResponse.redirect(redirectUrl)
}
