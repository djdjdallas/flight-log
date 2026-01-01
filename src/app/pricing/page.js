'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { PLANS, PLAN_ORDER } from '@/lib/stripe/config'
import { Check, Sparkles, ArrowLeft, Loader2 } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  async function handleSubscribe(planKey) {
    setLoading(planKey)
    setError('')

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to signup with plan info
        router.push(`/auth/signup?plan=${planKey}&billing=${annual ? 'yearly' : 'monthly'}`)
        return
      }

      const plan = PLANS[planKey]
      const priceId = annual ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly

      if (!priceId) {
        if (planKey === 'enterprise') {
          router.push('/contact')
          return
        }
        throw new Error('Price not configured')
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      console.error('Subscribe error:', err)
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-hero to-hero-light">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-sky-400 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">AeroNote</span>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:text-sky-400 hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-sky-200 max-w-2xl mx-auto mb-8">
          Choose the plan that fits your operation. All plans include a 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
          <Label htmlFor="billing-toggle" className={`text-sm ${!annual ? 'text-white' : 'text-sky-300'}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={annual}
            onCheckedChange={setAnnual}
          />
          <Label htmlFor="billing-toggle" className={`text-sm ${annual ? 'text-white' : 'text-sky-300'}`}>
            Annual
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
              Save 17%
            </span>
          </Label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto mb-8 px-6">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {PLAN_ORDER.map((planKey) => {
            const plan = PLANS[planKey]
            const price = annual ? plan.priceYearly : plan.priceMonthly
            const monthlyEquivalent = annual ? Math.round(plan.priceYearly / 12) : plan.priceMonthly

            return (
              <Card
                key={planKey}
                className={`relative overflow-hidden ${
                  plan.popular
                    ? 'border-sky-500 shadow-glow scale-105 z-10'
                    : 'border-white/10 bg-white/5 backdrop-blur'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader className={plan.popular ? '' : 'text-white'}>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className={plan.popular ? '' : 'text-sky-200'}>
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className={plan.popular ? '' : 'text-white'}>
                  <div className="mb-6">
                    {price !== null ? (
                      <>
                        <span className="text-4xl font-bold">${monthlyEquivalent}</span>
                        <span className={`${plan.popular ? 'text-muted-foreground' : 'text-sky-200'}`}>
                          /month
                        </span>
                        {annual && (
                          <p className={`text-sm mt-1 ${plan.popular ? 'text-muted-foreground' : 'text-sky-200'}`}>
                            Billed ${price} annually
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-sky-500' : 'text-sky-400'}`} />
                        <span className={`text-sm ${plan.popular ? '' : 'text-sky-100'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-sky-500 hover:bg-sky-600'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loading !== null}
                  >
                    {loading === planKey ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : planKey === 'enterprise' ? (
                      'Contact Sales'
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-sky-200">
            All plans include SSL encryption, daily backups, and 99.9% uptime SLA.
          </p>
          <p className="text-sky-300 mt-2">
            Questions? <Link href="/contact" className="text-sky-400 hover:underline">Contact our team</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
