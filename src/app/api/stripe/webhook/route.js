import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { constructWebhookEvent } from '@/lib/stripe/server'
import { getPlanByPriceId, getBillingInterval } from '@/lib/stripe/config'

// Use service role for webhook handlers (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event

  try {
    event = constructWebhookEvent(body, signature)
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await handleInvoiceFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session) {
  const customerId = session.customer
  const subscriptionId = session.subscription
  const userId = session.metadata?.supabaseUserId

  if (!customerId) return

  // Find organization by Stripe customer ID
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (org) {
    await supabaseAdmin
      .from('organizations')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', org.id)
  }

  console.log(`Checkout completed for customer ${customerId}`)
}

async function handleSubscriptionChange(subscription) {
  const customerId = subscription.customer
  const status = subscription.status
  const priceId = subscription.items?.data?.[0]?.price?.id

  // Determine plan from price ID
  const plan = getPlanByPriceId(priceId)
  const planName = plan?.key || 'pilot'
  const interval = getBillingInterval(priceId)

  // Map Stripe status to our status
  const subscriptionStatus = ['active', 'trialing'].includes(status)
    ? 'active'
    : status === 'past_due'
    ? 'past_due'
    : status === 'canceled'
    ? 'canceled'
    : 'inactive'

  // Update organization
  const { error } = await supabaseAdmin
    .from('organizations')
    .update({
      subscription_tier: planName,
      subscription_status: subscriptionStatus,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating organization subscription:', error)
  }

  console.log(`Subscription ${subscription.id} updated: ${planName} (${subscriptionStatus})`)
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer

  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  console.log(`Subscription deleted for customer ${customerId}`)
}

async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer
  console.log(`Invoice paid for customer ${customerId}`)
}

async function handleInvoiceFailed(invoice) {
  const customerId = invoice.customer

  await supabaseAdmin
    .from('organizations')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId)

  console.log(`Invoice payment failed for customer ${customerId}`)
}
