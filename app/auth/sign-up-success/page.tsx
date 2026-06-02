import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Crosshair, Mail, CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Crosshair className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">LeadHunter</span>
          </div>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription className="text-base">
                We&apos;ve sent you a confirmation link to verify your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4 text-left">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  What happens next?
                </h3>
                <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                  <li>Click the confirmation link in your email</li>
                  <li>You&apos;ll be redirected back to LeadHunter</li>
                  <li>Start automating your LinkedIn outreach</li>
                </ol>
              </div>

              <div className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <Link href="/auth/sign-up" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  try again
                </Link>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
