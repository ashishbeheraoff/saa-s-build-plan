'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import * as PricingCard from '@/components/ui/pricing-card'
import { 
  Check, 
  CreditCard, 
  Calendar, 
  Users, 
  MessageSquare, 
  Zap,
  ArrowUpRight,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { getMonthlyProducts, getYearlyProducts, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

// Mock current subscription data
const mockSubscription = {
  plan: 'Pro',
  status: 'active',
  interval: 'monthly',
  currentPeriodEnd: '2024-02-15',
  priceInCents: 14900,
  usage: {
    accounts: { used: 3, limit: 5 },
    connections: { used: 1847, limit: 2500 },
    messages: { used: 6234, limit: 10000 },
  },
}

const mockInvoices = [
  { id: 'inv_001', date: '2024-01-15', amount: 14900, status: 'paid' },
  { id: 'inv_002', date: '2023-12-15', amount: 14900, status: 'paid' },
  { id: 'inv_003', date: '2023-11-15', amount: 14900, status: 'paid' },
  { id: 'inv_004', date: '2023-10-15', amount: 14900, status: 'paid' },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function PlanCard({ product, isCurrentPlan }: { product: Product; isCurrentPlan: boolean }) {
  return (
    <PricingCard.Card className={cn('md:min-w-[260px]', isCurrentPlan && 'ring-2 ring-primary')}>
      <PricingCard.Header>
        <PricingCard.Plan>
          <PricingCard.PlanName>
            <span className="text-foreground">{product.name}</span>
          </PricingCard.PlanName>
          {product.popular && (
            <PricingCard.Badge>Most popular</PricingCard.Badge>
          )}
          {isCurrentPlan && (
            <PricingCard.Badge>Current plan</PricingCard.Badge>
          )}
        </PricingCard.Plan>
        <PricingCard.Price>
          <PricingCard.MainPrice className="text-foreground">
            {formatCurrency(product.priceInCents)}
          </PricingCard.MainPrice>
          <PricingCard.Period>/{product.interval}</PricingCard.Period>
        </PricingCard.Price>
        <Button
          variant={product.popular ? 'default' : 'outline'}
          className={cn('w-full font-semibold')}
          asChild
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? (
            <span>Current plan</span>
          ) : (
            <Link href={`/checkout?plan=${product.id}`}>
              {product.priceInCents > mockSubscription.priceInCents ? 'Upgrade' : 'Downgrade'}
            </Link>
          )}
        </Button>
      </PricingCard.Header>

      <PricingCard.Body>
        <PricingCard.Description>
          {product.description}
        </PricingCard.Description>
        <PricingCard.List>
          {product.features.map((item) => (
            <PricingCard.ListItem key={item}>
              <CheckCircle2
                className="text-primary h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span className="text-foreground/80">{item}</span>
            </PricingCard.ListItem>
          ))}
        </PricingCard.List>
      </PricingCard.Body>
    </PricingCard.Card>
  )
}

function UsageCard({ 
  icon: Icon, 
  title, 
  used, 
  limit, 
  unit 
}: { 
  icon: React.ElementType
  title: string
  used: number
  limit: number
  unit: string
}) {
  const percentage = (used / limit) * 100
  const isNearLimit = percentage > 80
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isNearLimit ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              <Icon className={`h-4 w-4 ${isNearLimit ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <span className="font-medium">{title}</span>
          </div>
          {isNearLimit && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{used.toLocaleString()} / {limit.toLocaleString()} {unit}</span>
            <span className={isNearLimit ? 'text-destructive font-medium' : 'text-muted-foreground'}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={percentage} className={isNearLimit ? '[&>div]:bg-destructive' : ''} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function BillingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  
  const products = billingInterval === 'month' ? getMonthlyProducts() : getYearlyProducts()

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm">
          Manage your subscription, usage, and billing information
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Current Plan</CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </div>
                <Badge variant={mockSubscription.status === 'active' ? 'default' : 'destructive'}>
                  {mockSubscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{mockSubscription.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(mockSubscription.priceInCents)}/month · Renews on {mockSubscription.currentPeriodEnd}
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="#plans">
                    Change plan
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Payment method</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Visa ending in 4242</span>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Next billing date</span>
                </div>
                <span className="text-sm">{mockSubscription.currentPeriodEnd}</span>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Usage this period</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <UsageCard 
                icon={Users} 
                title="LinkedIn Accounts" 
                used={mockSubscription.usage.accounts.used}
                limit={mockSubscription.usage.accounts.limit}
                unit="accounts"
              />
              <UsageCard 
                icon={Zap} 
                title="Connection Requests" 
                used={mockSubscription.usage.connections.used}
                limit={mockSubscription.usage.connections.limit}
                unit="requests"
              />
              <UsageCard 
                icon={MessageSquare} 
                title="Messages Sent" 
                used={mockSubscription.usage.messages.used}
                limit={mockSubscription.usage.messages.limit}
                unit="messages"
              />
            </div>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Choose a plan</h2>
              <p className="text-sm text-muted-foreground">
                Select the plan that best fits your needs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="billing-toggle" className="text-sm text-muted-foreground">Monthly</Label>
              <Switch 
                id="billing-toggle"
                checked={billingInterval === 'year'}
                onCheckedChange={(checked) => setBillingInterval(checked ? 'year' : 'month')}
              />
              <Label htmlFor="billing-toggle" className="text-sm">
                Yearly
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </Label>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <PlanCard 
                key={product.id} 
                product={product} 
                isCurrentPlan={product.name === mockSubscription.plan && product.interval === 'month'}
              />
            ))}
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice History</CardTitle>
              <CardDescription>Download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={invoice.status === 'paid' ? 'secondary' : 'destructive'}>
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
