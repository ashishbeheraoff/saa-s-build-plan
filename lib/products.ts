export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

// Subscription plans for LeadRaider
export const PRODUCTS: Product[] = [
  {
    id: 'starter-monthly',
    name: 'Starter',
    description: 'Perfect for individuals getting started with LinkedIn outreach',
    priceInCents: 4900, // $49/month
    interval: 'month',
    features: [
      '1 LinkedIn account',
      '500 connection requests/month',
      '1,000 messages/month',
      'Basic AI personalization',
      'Email support',
    ],
  },
  {
    id: 'starter-yearly',
    name: 'Starter',
    description: 'Perfect for individuals getting started with LinkedIn outreach',
    priceInCents: 47000, // $470/year (save ~20%)
    interval: 'year',
    features: [
      '1 LinkedIn account',
      '500 connection requests/month',
      '1,000 messages/month',
      'Basic AI personalization',
      'Email support',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    description: 'For growing teams scaling their outreach efforts',
    priceInCents: 14900, // $149/month
    interval: 'month',
    popular: true,
    features: [
      '5 LinkedIn accounts',
      '2,500 connection requests/month',
      '10,000 messages/month',
      'Advanced AI personalization',
      'Lead scoring & qualification',
      'CRM integrations',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro',
    description: 'For growing teams scaling their outreach efforts',
    priceInCents: 142800, // $1,428/year (save ~20%)
    interval: 'year',
    popular: true,
    features: [
      '5 LinkedIn accounts',
      '2,500 connection requests/month',
      '10,000 messages/month',
      'Advanced AI personalization',
      'Lead scoring & qualification',
      'CRM integrations',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    priceInCents: 49900, // $499/month
    interval: 'month',
    features: [
      'Unlimited LinkedIn accounts',
      'Unlimited connection requests',
      'Unlimited messages',
      'Custom AI model training',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security & compliance',
      'Team management',
      'API access',
    ],
  },
  {
    id: 'enterprise-yearly',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    priceInCents: 479000, // $4,790/year (save ~20%)
    interval: 'year',
    features: [
      'Unlimited LinkedIn accounts',
      'Unlimited connection requests',
      'Unlimited messages',
      'Custom AI model training',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security & compliance',
      'Team management',
      'API access',
    ],
  },
]

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}

export function getMonthlyProducts() {
  return PRODUCTS.filter((p) => p.interval === 'month')
}

export function getYearlyProducts() {
  return PRODUCTS.filter((p) => p.interval === 'year')
}
