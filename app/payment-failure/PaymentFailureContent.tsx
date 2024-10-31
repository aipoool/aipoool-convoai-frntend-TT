'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentFailureContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('token')
  console.log("Token here :: " , error);
  useEffect(() => {
    if (!error) {
      router.push('/')
    }
  }, [error, router])

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-2xl">Payment Failed</CardTitle>
        <CardDescription>
          We could not process your payment
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {error || 'An error occurred during the payment process.'}
        </p>
        <p className="text-sm text-muted-foreground">
          Please try again or contact support if the problem persists.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Try Again
        </Button>
        <Button onClick={() => router.push('/support')}>
          Contact Support
        </Button>
      </CardFooter>
    </Card>
  )
}