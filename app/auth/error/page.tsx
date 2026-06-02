import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Crosshair, AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription className="text-base">
                Something went wrong during authentication. This could happen if:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="text-sm text-muted-foreground text-left space-y-2 ml-4 list-disc">
                <li>The confirmation link has expired</li>
                <li>The link has already been used</li>
                <li>There was a network error</li>
              </ul>

              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Try signing in</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/sign-up">Create new account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
