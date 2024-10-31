/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLinkedin, FiTwitter, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { RiTwitterXLine } from "react-icons/ri"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Plan {
  name: string
  price: number
  features: string[]
}

interface ErrorMessageProps {
  message: string
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: 9.99,
    features: [
      'Up to 100 conversations/month',
      'Basic AI responses',
      'Email support',
      'Standard response time'
    ]
  },
  {
    name: 'Pro',
    price: 29.99,
    features: [
      'Unlimited conversations',
      'Advanced AI responses',
      'Priority support',
      'Faster response time',
      'Custom AI training'
    ]
  },
  {
    name: 'Enterprise',
    price: 99.99,
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integration',
      'API access',
      'SLA guarantee',
      'Advanced analytics'
    ]
  },
]

const downgradeReasons = [
  'Too expensive',
  'Not using all features',
  'Found a better alternative',
  'Technical issues',
  'Temporary pause needed',
  'Other'
]

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div className="flex items-center">
      <FiAlertCircle className="text-red-400 mr-2" />
      <p className="text-red-700">{message}</p>
    </div>
  </div>
)

export default function ChangePlanWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [action, setAction] = useState<'upgrade' | 'downgrade' | null>(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      fetchCurrentPlan(urlToken)
    } else {
      setErrorMessage('Invalid access. Please try again.')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }, [searchParams, router])

  const fetchCurrentPlan = async (token: string) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      // Replace with your actual API endpoint
      const response = await fetch('/api/current-plan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch current plan')
      
      const data = await response.json()
      setCurrentPlan(data)
    } catch (error) {
      setErrorMessage('Failed to fetch your current plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanChange = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      // Replace with your actual API endpoint
      const response = await fetch('/api/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          newPlan: selectedPlan?.name,
          reason: action === 'downgrade' ? {
            selected: selectedReason,
            custom: customReason
          } : null
        })
      })

      if (!response.ok) throw new Error('Failed to process plan change')

      router.push(`/payment-result?status=success&plan=${selectedPlan?.name}`)
    } catch (error) {
      setErrorMessage('Failed to process your request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const renderStep = (): ReactNode => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Current Plan Details</CardTitle>
                <CardDescription>Review your current plan details before making changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Plan Name</Label>
                  <p className="text-lg font-medium">{currentPlan?.name}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Price</Label>
                  <p className="text-lg font-medium">${currentPlan?.price}/month</p>
                </div>
                <div className="grid gap-2">
                  <Label>Features</Label>
                  <ul className="space-y-2">
                    {currentPlan?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FiCheck className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button onClick={nextStep}>Next</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Action</CardTitle>
                <CardDescription>Would you like to upgrade or downgrade your plan?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={action || ''} 
                  onValueChange={(value) => setAction(value as 'upgrade' | 'downgrade')}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upgrade" id="upgrade" />
                    <Label htmlFor="upgrade">Upgrade Plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="downgrade" id="downgrade" />
                    <Label htmlFor="downgrade">Downgrade Plan</Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!action}>Next</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )

      case 3: {
        if (action !== 'downgrade') {
          nextStep();
          return null;
        }

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Reason for Downgrading</CardTitle>
                <CardDescription>
                  Please select a reason for downgrading and provide additional details if needed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={selectedReason} 
                  onValueChange={setSelectedReason}
                  className="space-y-3"
                >
                  {downgradeReasons.map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={reason} />
                      <Label htmlFor={reason}>{reason}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="space-y-2">
                  <Label htmlFor="customReason">Additional Details</Label>
                  <Input
                    id="customReason"
                    placeholder="Please provide more details about your reason for downgrading..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="h-24"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!selectedReason}>Next</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      }

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>
                  Select a plan that better suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans
                    .filter((plan) => 
                      action === 'upgrade' 
                        ? plan.price > (currentPlan?.price || 0)
                        : plan.price < (currentPlan?.price || 0)
                    )
                    .map((plan) => (
                      <Card
                        key={plan.name}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPlan?.name === plan.name 
                            ? 'border-primary ring-2 ring-primary' 
                            : 'border-border'
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription className="text-xl font-semibold">
                            ${plan.price}/month
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <FiCheck className="text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!selectedPlan}>Next</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Confirmation</CardTitle>
                <CardDescription>Review your plan change before proceeding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Current Plan</Label>
                  <p>{currentPlan?.name} (${currentPlan?.price}/month)</p>
                </div>
                <div className="grid gap-2">
                  <Label>New Plan</Label>
                  <p>{selectedPlan?.name} (${selectedPlan?.price}/month)</p>
                </div>
                {action === 'downgrade' && (
                  <div className="grid gap-2">
                    <Label>Reason for Downgrade</Label>
                    <p>{selectedReason}</p>
                    {customReason && (
                      <p className="text-sm text-muted-foreground">{customReason}</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button 
                  onClick={handlePlanChange}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (isLoading && !currentPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 shadow-sm z-10">
        <Image  src="/logo.svg" alt="ConvoAI Logo" width={100} height={40} />
        <div className="flex space-x-4">
          <FiLinkedin className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <FiTwitter className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <RiTwitterXLine className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">Change Plan</h1>
          {errorMessage && <ErrorMessage message={errorMessage} />}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white bg-opacity-80 shadow-sm mt-8 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Terms & Conditions</a>
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Privacy Policy</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <Image src="/logo.svg" alt="ConvoAI Logo" width={80} height={32} />
          </div>
        </div>
      </footer>
    </div>
  )
}