import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createBillingPortalSession } from '@/lib/stripe/server'

export async function POST(request) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's organization and Stripe customer ID
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('organizations(stripe_customer_id)')
      .eq('id', user.id)
      .single()

    const customerId = profile?.organizations?.stripe_customer_id

    if (!customerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL
    const session = await createBillingPortalSession({
      customerId,
      returnUrl: `${origin}/dashboard/settings`
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
