'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { PLANS } from '@/lib/stripe/config'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

export default function BillingSettings() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchSubscription()

    // Check for success param from Stripe checkout
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Your subscription has been activated successfully!')
      // Clear the URL params
      window.history.replaceState({}, '', '/dashboard/settings')
    }
  }, [searchParams])

  async function fetchSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organizations(subscription_tier, subscription_status, stripe_customer_id)')
        .eq('id', user.id)
        .single()

      if (profile?.organizations) {
        setSubscription({
          tier: profile.organizations.subscription_tier || 'free',
          status: profile.organizations.subscription_status || 'inactive',
          hasStripeCustomer: !!profile.organizations.stripe_customer_id
        })
      } else {
        setSubscription({ tier: 'free', status: 'inactive', hasStripeCustomer: false })
      }
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError('Failed to load subscription details')
    } finally {
      setLoading(false)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err.message)
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const currentPlan = PLANS[subscription?.tier] || PLANS.pilot
  const isFreeTier = subscription?.tier === 'free' || !subscription?.tier
  const isActive = subscription?.status === 'active'

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Plan */}
      <div className="rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">
                {isFreeTier ? 'Free Plan' : `${currentPlan.name} Plan`}
              </h3>
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : subscription?.status || 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isFreeTier
                ? 'You are currently on the free plan with limited features.'
                : currentPlan.description
              }
            </p>
          </div>
          {!isFreeTier && currentPlan.priceMonthly && (
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPlan.priceMonthly}</div>
              <div className="text-sm text-muted-foreground">/month</div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        {!isFreeTier && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Your plan includes:</h4>
            <ul className="grid grid-cols-2 gap-2">
              {currentPlan.features.slice(0, 6).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Usage Stats (for paid plans) */}
      {!isFreeTier && (
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">—</div>
              <div className="text-sm text-muted-foreground">
                of {currentPlan.limits.aircraft === -1 ? '∞' : currentPlan.limits.aircraft} aircraft
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">—</div>
              <div className="text-sm text-muted-foreground">
                of {currentPlan.limits.flightsPerMonth === -1 ? '∞' : currentPlan.limits.flightsPerMonth} flights
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">—</div>
              <div className="text-sm text-muted-foreground">
                of {currentPlan.limits.teamMembers === -1 ? '∞' : currentPlan.limits.teamMembers} team members
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {isFreeTier ? (
          <Link href="/pricing">
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>
        ) : (
          <>
            {subscription?.hasStripeCustomer && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Manage Billing
              </Button>
            )}
            <Link href="/pricing">
              <Button variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Change Plan
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Billing Portal Info */}
      {subscription?.hasStripeCustomer && (
        <p className="text-sm text-muted-foreground">
          Use the billing portal to update your payment method, view invoices, or cancel your subscription.
        </p>
      )}
    </div>
  )
}
