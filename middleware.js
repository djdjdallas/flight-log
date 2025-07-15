import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/onboarding']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedPath && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check onboarding status for authenticated users
  if (session) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single()

      // If accessing dashboard but onboarding not completed, redirect to onboarding
      if (req.nextUrl.pathname.startsWith('/dashboard') && !profile?.onboarding_completed) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/onboarding'
        return NextResponse.redirect(redirectUrl)
      }

      // If accessing onboarding but already completed, redirect to dashboard
      if (req.nextUrl.pathname.startsWith('/onboarding') && profile?.onboarding_completed) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // If there's an error and trying to access dashboard, redirect to onboarding
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/onboarding'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/auth/login',
    '/auth/signup'
  ]
}