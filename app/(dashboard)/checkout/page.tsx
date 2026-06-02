'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Check, Shield, Zap, Tag, X } from 'lucide-react'
import Checkout from '@/components/checkout'
import { getProductById } from '@/lib/products'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null)

  if (!planId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No plan selected</p>
        <Button asChild className="mt-4">
          <Link href="/billing">View plans</Link>
        </Button>
      </div>
    )
  }

  const product = getProductById(planId)

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Plan not found</p>
        <Button asChild className="mt-4">
          <Link href="/billing">View plans</Link>
        </Button>
      </div>
    )
  }

  const handleApplyPromo = () => {
    if (promoCode === 'SUMMER50') {
      setAppliedPromo({ code: 'SUMMER50', discount: 50, type: 'percentage' })
    } else if (promoCode === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discount: 10, type: 'fixed' })
    } else {
      setAppliedPromo(null)
    }
  }

  const basePrice = product.priceInCents / 100
  let finalPrice = basePrice
  let discountAmount = 0

  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = (basePrice * appliedPromo.discount) / 100
    } else {
      discountAmount = appliedPromo.discount
    }
    finalPrice = Math.max(0, basePrice - discountAmount)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <CardDescription>Review your subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{product.name} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Billed {product.interval === 'month' ? 'monthly' : 'annually'}
                  </p>
                </div>
              </div>
              {product.popular && (
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-3">What&apos;s included:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promo Code Section */}
            <div className="border rounded-lg p-4 bg-primary/5">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Tag className="h-4 w-4 text-primary" />
                Promo Code
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  disabled={!!appliedPromo}
                />
                {appliedPromo ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setAppliedPromo(null)
                      setPromoCode('')
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                )}
              </div>
              {appliedPromo && (
                <p className="text-sm text-primary mt-2 font-medium">
                  ✓ Code {appliedPromo.code} applied: {appliedPromo.discount}{appliedPromo.type === 'percentage' ? '%' : '$'} off
                </p>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${basePrice.toFixed(2)}/{product.interval}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between items-center text-primary">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
              {product.interval === 'year' && (
                <p className="text-sm text-primary mt-2">
                  You&apos;re saving 20% with annual billing
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Stripe Checkout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
          <CardDescription>Complete your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <Checkout productId={planId} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/billing">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to billing
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-sm">
          Complete your subscription to get started
        </p>
      </div>

      <Suspense fallback={
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
