'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Send, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const emailTypes = [
  { value: 'welcome', label: 'Welcome Email', description: 'Sent when a user signs up' },
  { value: 'confirm', label: 'Email Confirmation', description: 'Verify email address' },
  { value: 'password-reset', label: 'Password Reset', description: 'Reset password link' },
  { value: 'subscription', label: 'Subscription Confirmation', description: 'Subscription started' },
]

export function EmailTester() {
  const [selectedType, setSelectedType] = useState('welcome')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [formData, setFormData] = useState({
    companyName: 'LinkedLeads',
    userName: 'John Doe',
    planName: 'Pro',
    planPrice: '$99',
    cycleLabel: 'month',
  })

  const handleSendEmail = async () => {
    if (!email) {
      setResult({ success: false, message: 'Please enter an email address' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          email,
          ...formData,
        }),
      })

      const data = await response.json()
      setResult({
        success: response.ok,
        message: data.message || data.error || 'Unknown error',
      })
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error'),
      })
    } finally {
      setLoading(false)
    }
  }

  const currentEmailType = emailTypes.find((t) => t.value === selectedType)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Email Template Tester</h2>
        <p className="text-muted-foreground mt-1">Send test emails using React Email templates</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Send Test Email</TabsTrigger>
          <TabsTrigger value="templates-list">Available Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Choose Email Type
              </CardTitle>
              <CardDescription>Select the email template to test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emailTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Set up the email details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Recipient Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="LinkedLeads"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              {['confirm', 'password-reset', 'subscription'].includes(selectedType) && (
                <div className="space-y-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    placeholder="John Doe"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  />
                </div>
              )}

              {selectedType === 'subscription' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan Name</Label>
                      <Input
                        id="plan"
                        placeholder="Pro"
                        value={formData.planName}
                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Plan Price</Label>
                      <Input
                        id="price"
                        placeholder="$99"
                        value={formData.planPrice}
                        onChange={(e) => setFormData({ ...formData, planPrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycle">Billing Cycle</Label>
                    <Input
                      id="cycle"
                      placeholder="month"
                      value={formData.cycleLabel}
                      onChange={(e) => setFormData({ ...formData, cycleLabel: e.target.value })}
                    />
                  </div>
                </>
              )}

              {result && (
                <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
                  <p className="font-medium">{result.success ? '✓ Success' : '✗ Error'}</p>
                  <p className="text-sm">{result.message}</p>
                </div>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={loading || !email}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates-list" className="space-y-4">
          <div className="grid gap-4">
            {emailTypes.map((type) => (
              <Card key={type.value}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{type.label}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{type.value}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {type.value === 'welcome' && 'Welcome email sent to new users with company information and dashboard link.'}
                    {type.value === 'confirm' && 'Email verification link to confirm the user&apos;s email address.'}
                    {type.value === 'password-reset' && 'Password reset link allowing users to securely reset their account password.'}
                    {type.value === 'subscription' && 'Subscription confirmation email showing plan details, pricing, and next billing date.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedType(type.value)}
                  >
                    Test This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
