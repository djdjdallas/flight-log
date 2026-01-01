import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

export async function redirectToCheckout(sessionId) {
  const stripe = await getStripe()
  if (!stripe) {
    throw new Error('Stripe failed to load')
  }
  const { error } = await stripe.redirectToCheckout({ sessionId })
  if (error) {
    throw error
  }
}

export async function redirectToBillingPortal() {
  const response = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create portal session')
  }

  const { url } = await response.json()
  window.location.href = url
}
