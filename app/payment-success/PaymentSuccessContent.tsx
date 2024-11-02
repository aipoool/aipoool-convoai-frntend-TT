'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Settings, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addMonths } from 'date-fns'

interface PlanDetails {
  name: string;
  price: string;
  startDate: Date;
}

export default function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('id')
  const token = searchParams.get('token'); 
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchPlanDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Assuming you store the auth token in localStorage
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch subscription details')
        }

        const data = await response.json()
        console.log("The subscription details here :: " , data); 


        setPlanDetails({
          name: data.name,
          price: data.billing_cycles[0].pricing_scheme.fixed_price.value + "$",
          startDate: new Date(),
        })
      
      } catch (err) {
        setError('An error occurred while fetching subscription details')
        console.error('Error fetching subscription details:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlanDetails()
  }, [subscriptionId, token, searchParams])

  const handleEmailInvoice = async () => {
    setIsLoading(true)
    try {
      // Simulating an API call to email the invoice
      ///await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Invoice has been sent to your email.')
    } catch (error) {
      console.error('Failed to send invoice:', error)
      alert('Failed to send invoice. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !planDetails) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  const nextBillingDate = addMonths(planDetails.startDate, 1)

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
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Plan Details</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
              <dd className="mt-1 text-lg font-semibold">{planDetails.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cost</dt>
              <dd className="mt-1 text-lg font-semibold">${planDetails.price}/month</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-lg font-semibold">{format(planDetails.startDate, 'MMMM d, yyyy')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
              <dd className="mt-1 text-lg font-semibold">{format(nextBillingDate, 'MMMM d, yyyy')}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          onClick={() => router.push('chrome-extension://dnjmipaneoddchfeamgdabpiomihncii/assets/settings.html')}
          className="w-full sm:w-auto"
        >
          <Settings className="mr-2 h-4 w-4" />
          Go to Settings
        </Button>
        <Button 
          variant="outline" 
          onClick={handleEmailInvoice}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email me the invoice
        </Button>
      </CardFooter>
    </Card>
  )
}


