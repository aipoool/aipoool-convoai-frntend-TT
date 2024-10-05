'use client'

import { SetStateAction, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiLinkedin, FiTwitter } from 'react-icons/fi'
import { RiTwitterXLine } from "react-icons/ri"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

interface PlanDetails {
  name: string;
  price: number;
  renewalDate: string;
  paymentPlanId: string;
  email: string;
}

const reasons = [
  "Too expensive",
  "Not using it enough",
  "Found a better alternative",
  "Missing features",
  "Other"
]

export default function UnsubscribeWizard() {
  const [step, setStep] = useState(1)
  const [planDetails] = useState<PlanDetails>({
    name: "Pro Plan",
    price: 29.99,
    renewalDate: "2024-05-01",
    paymentPlanId: "plan_123456",
    email: "user@example.com"
  })
  const [reason, setReason] = useState("")
  const [otherReason, setOtherReason] = useState("")

  const handleProceed = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    // Here you would typically send the data to your backend
    console.log("Submitting:", { planDetails, reason: reason === "Other" ? otherReason : reason })
    setStep(3)
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
          <h1 className="text-3xl font-bold text-[#4f89b7] mb-6 text-center">Unsubscribe</h1>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Current Plan Details</h2>
              <div className="space-y-2 mb-6">
                <p><strong>Plan Name:</strong> {planDetails.name}</p>
                <p><strong>Price:</strong> ${planDetails.price}/month</p>
                <p><strong>Next Renewal Date:</strong> {planDetails.renewalDate}</p>
                <p><strong>Payment Plan ID:</strong> {planDetails.paymentPlanId}</p>
                <p><strong>Email:</strong> {planDetails.email}</p>
              </div>
              <Button onClick={handleProceed} className="w-full">Okay, Proceed</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Reason for Unsubscribing</h2>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-2 mb-6">
                {reasons.map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <RadioGroupItem value={r} id={r} />
                    <Label htmlFor={r}>{r}</Label>
                  </div>
                ))}
              </RadioGroup>
              {reason === "Other" && (
                <div className="mb-6">
                  <Label htmlFor="otherReason">Please specify:</Label>
                  <Input
                    id="otherReason"
                    value={otherReason}
                    onChange={(e: { target: { value: SetStateAction<string> } }) => setOtherReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              <Button onClick={handleSubmit} className="w-full" disabled={!reason || (reason === "Other" && !otherReason)}>
                Submit
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8"
            >
              <div className="w-full md:w-1/3">
                <Image
                  src="/unsubscribe.png"
                  alt="Standing character"
                  width={300}
                  height={400}
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}
                />
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-2xl font-semibold mb-4">Sad to see you going!</h2>
                <p className="mb-6">Thank you for being part of ConvoAI.</p>
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex-1">See Other Plans</Button>
                  <Button variant="outline" className="flex-1">Go to Main Page</Button>
                  <Button variant="outline" className="flex-1">Provide Feedback</Button>
                </div>
              </div>
            </motion.div>
          )}
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