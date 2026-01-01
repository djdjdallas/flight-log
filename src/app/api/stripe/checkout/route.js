import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { stripe, createCustomer, createCheckoutSession } from '@/lib/stripe/server'

export async function POST(request) {
  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerComponentClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile and organization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*, organizations(*)')
      .eq('id', user.id)
      .single()

    let customerId = profile?.organizations?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer({
        email: user.email,
        name: profile?.full_name || user.email,
        userId: user.id
      })
      customerId = customer.id

      // Update organization with Stripe customer ID
      if (profile?.organization_id) {
        await supabase
          .from('organizations')
          .update({ stripe_customer_id: customerId })
          .eq('id', profile.organization_id)
      } else {
        // Create organization for user if none exists
        const { data: org } = await supabase
          .from('organizations')
          .insert({
            name: profile?.full_name || 'My Organization',
            stripe_customer_id: customerId,
            subscription_tier: 'free'
          })
          .select()
          .single()

        if (org) {
          await supabase
            .from('user_profiles')
            .update({ organization_id: org.id })
            .eq('id', user.id)
        }
      }
    }

    // Create checkout session
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL
    const session = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl: `${origin}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancelUrl: `${origin}/pricing?canceled=true`
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
