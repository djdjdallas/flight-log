// Stripe pricing configuration
// These price IDs should match your Stripe dashboard products

export const PLANS = {
  pilot: {
    name: 'Pilot',
    description: 'For individual drone operators',
    priceMonthly: 29,
    priceYearly: 290,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PILOT_MONTHLY_PRICE_ID,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PILOT_YEARLY_PRICE_ID,
    features: [
      '5 aircraft',
      '100 flight logs/month',
      'Basic compliance reports',
      'Email support',
      'DJI log import'
    ],
    limits: {
      aircraft: 5,
      flightsPerMonth: 100,
      teamMembers: 1
    }
  },
  team: {
    name: 'Team',
    description: 'For drone service companies',
    priceMonthly: 99,
    priceYearly: 990,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID,
    features: [
      'Unlimited aircraft',
      'Unlimited flight logs',
      'Advanced compliance reports',
      'Priority support',
      'All log formats',
      'Team management',
      'API access'
    ],
    limits: {
      aircraft: -1, // unlimited
      flightsPerMonth: -1,
      teamMembers: 10
    },
    popular: true
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    priceMonthly: null, // custom pricing
    priceYearly: null,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: [
      'Everything in Team',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Audit logs'
    ],
    limits: {
      aircraft: -1,
      flightsPerMonth: -1,
      teamMembers: -1
    }
  }
}

export const PLAN_ORDER = ['pilot', 'team', 'enterprise']

export function getPlanByPriceId(priceId) {
  for (const [planKey, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceIdMonthly === priceId || plan.stripePriceIdYearly === priceId) {
      return { key: planKey, ...plan }
    }
  }
  return null
}

export function getBillingInterval(priceId) {
  for (const plan of Object.values(PLANS)) {
    if (plan.stripePriceIdMonthly === priceId) return 'month'
    if (plan.stripePriceIdYearly === priceId) return 'year'
  }
  return null
}
