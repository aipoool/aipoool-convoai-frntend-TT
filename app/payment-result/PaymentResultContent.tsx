'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'

export default function PaymentResultContent() {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('status')
    setIsSuccess(status === 'success')
  }, [searchParams])

  const handleMainPageClick = () => {
    window.location.href = "/"
  }

  const handlePricingPageClick = () => {
    window.location.href = "/pricing"
  }

  const handleReportIssueClick = () => {
    console.log("Report issue clicked")
  }

  if (isSuccess === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col ${isSuccess ? 'md:flex-row-reverse' : 'md:flex-row'} items-center md:items-start gap-8`}
      >
        <div className="w-full md:w-1/3">
          <Image
            src={isSuccess ? "/success-character.svg" : "/failure-character.svg"}
            alt={isSuccess ? "Success character" : "Failure character"}
            width={300}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h1 className={`text-3xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'} mb-4`}>
            {isSuccess ? "Thank You for Subscribing!" : "Payment Failed"}
          </h1>
          <p className="text-lg mb-6">
            {isSuccess 
              ? "Your subscription has been successfully processed. Welcome to ConvoAI!" 
              : "We're sorry, but there was an issue processing your payment. Please try again or contact support."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            {isSuccess ? (
              <Button onClick={handleMainPageClick}>Go to Main Page</Button>
            ) : (
              <>
                <Button onClick={handlePricingPageClick}>Go to Pricing Page</Button>
                <Button variant="outline" onClick={handleReportIssueClick}>Report Issue</Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}