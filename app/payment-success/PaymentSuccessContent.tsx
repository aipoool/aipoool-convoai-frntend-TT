'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('token')
  console.log("Token here :: " , plan)

  useEffect(() => {
    if (!plan) {
      router.push('/')
    }
  }, [plan, router])

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <CardDescription>
          Your subscription has been updated successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          You are now subscribed to the {plan} plan. Your new features are now active.
        </p>
        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent to your registered email address.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}