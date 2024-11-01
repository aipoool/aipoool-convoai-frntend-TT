/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


interface SubscriptionDetails {
  planName: string;
  status: string;
  nextBillingDate: string;
}

export default function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('id')
  const token = searchParams.get('token'); 
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const fetchSubscriptionDetails = async () => {
      try {
        const response = await fetch(`/api/subscription-details/${subscriptionId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Assuming you store the auth token in localStorage
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch subscription details')
        }

        const data = await response.json()
        console.log("The subscription details here :: " , data); 
      
        setSubscriptionDetails(data)
      } catch (err) {
        setError('An error occurred while fetching subscription details')
        console.error('Error fetching subscription details:', err)
      } finally {
        setIsLoading(false)
      }
    }

    //fetchSubscriptionDetails()

    console.log(subscriptionId); 
    console.log(token); 

  },[subscriptionId, router])

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
          You are now subscribed to the plan. Your new features are now active.
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