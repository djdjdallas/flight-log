import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: false
})

export async function createCustomer({ email, name, userId }) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      supabaseUserId: userId
    }
  })
  return customer
}

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        supabaseUserId: userId
      }
    },
    metadata: {
      supabaseUserId: userId
    }
  })
  return session
}

export async function createBillingPortalSession({ customerId, returnUrl }) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  })
  return session
}

export async function getSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export async function cancelSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  })
  return subscription
}

export async function reactivateSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  })
  return subscription
}

export function constructWebhookEvent(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
