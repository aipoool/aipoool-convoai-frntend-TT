'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiLinkedin, FiTwitter } from 'react-icons/fi'
import { RiTwitterXLine } from "react-icons/ri"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'

const GridBackground = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const gridSize = 50;
    const columns = Math.ceil(windowSize.width / gridSize);
    const rows = Math.ceil(windowSize.height / gridSize);
  
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {[...Array(rows)].map((_, rowIndex) =>
            [...Array(columns)].map((_, colIndex) => (
              <motion.line
                key={`${rowIndex}-${colIndex}`}
                x1={colIndex * gridSize}
                y1={rowIndex * gridSize}
                x2={(colIndex + 1) * gridSize}
                y2={rowIndex * gridSize}
                stroke="#4f89b7"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (rowIndex + colIndex) * 0.1,
                }}
              />
            ))
          )}
          {[...Array(columns)].map((_, colIndex) =>
            [...Array(rows)].map((_, rowIndex) => (
              <motion.line
                key={`${colIndex}-${rowIndex}-vertical`}
                x1={colIndex * gridSize}
                y1={rowIndex * gridSize}
                x2={colIndex * gridSize}
                y2={(rowIndex + 1) * gridSize}
                stroke="#4f89b7"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: (rowIndex + colIndex) * 0.1,
                }}
              />
            ))
          )}
        </svg>
      </div>
    );
  };

export default function PaymentResultPage() {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // In a real application, you might want to verify the payment status with your backend
    const status = searchParams.get('status')
    setIsSuccess(status === 'success')
  }, [searchParams])

  const handleMainPageClick = () => {
    // Navigate to main page
    window.location.href = "/"
  }

  const handlePricingPageClick = () => {
    // Navigate to pricing page
    window.location.href = "/pricing"
  }

  const handleReportIssueClick = () => {
    // Implement report issue functionality
    console.log("Report issue clicked")
  }

  if (isSuccess === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <GridBackground />

      <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 shadow-sm z-10">
        <Image src="/logo.svg" alt="ConvoAI Logo" width={100} height={40} />
        <div className="flex space-x-4">
          <FiLinkedin className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <FiTwitter className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <RiTwitterXLine className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col ${isSuccess ? 'md:flex-row-reverse' : 'md:flex-row'} items-center md:items-start gap-8`}
          >
            <div className="w-full md:w-1/3">
              <Image
                src={isSuccess ? "/payment-success.png" : "/payment-failed.png"}
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
      </main>

      <footer className="bg-white bg-opacity-80 shadow-sm mt-8 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Terms & Conditions</a>
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Privacy Policy</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <Image src="" alt="ConvoAI Logo" width={80} height={32} />
          </div>
        </div>
      </footer>
    </div>
  )
}