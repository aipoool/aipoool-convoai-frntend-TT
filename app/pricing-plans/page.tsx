'use client'

import { Button } from "@/components/ui/button"
import { FiLinkedin, FiTwitter, FiCheck } from 'react-icons/fi'
import { RiTwitterXLine } from "react-icons/ri"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const GridBackground = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {[...Array(10)].map((_, i) => (
          [...Array(10)].map((_, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${j * 10}%`}
              y1={`${i * 10}%`}
              x2={`${(j + 1) * 10}%`}
              y2={`${i * 10}%`}
              stroke="#4f89b7"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: (i + j) * 0.1,
              }}
            />
          ))
        ))}
      </svg>
    </div>
  )
}

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isPopular }) => (
  <motion.div
    className={`bg-white p-6 rounded-lg shadow-lg ${isPopular ? 'border-4 border-[#4f89b7]' : ''} relative overflow-hidden`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 overflow-hidden w-28 h-28">
        <div className="popular-tag">Popular</div>
      </div>
    )}
    <h3 className="text-2xl font-bold text-[#4f89b7] mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-6">${price.toFixed(2)}<span className="text-sm font-normal">/month</span></p>
    <ul className="mb-6 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <FiCheck className="text-[#4f89b7] mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      className="w-full bg-white text-[#4f89b7] border border-[#4f89b7] hover:bg-[#f0f7fc] transition-all duration-300"
    >
      Choose Plan
    </Button>
  </motion.div>
)

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <GridBackground />

      <style jsx global>{`
        @keyframes wave {
          0% {
            transform: rotate(45deg) translateY(0%);
          }
          50% {
            transform: rotate(45deg) translateY(-2%);
          }
          100% {
            transform: rotate(45deg) translateY(0%);
          }
        }

        .popular-tag {
          position: absolute;
          top: 20px;
          right: -27px;
          background: #4f89b7;
          color: white;
          padding: 4px 30px;
          font-size: 0.8rem;
          font-weight: bold;
          transform: rotate(45deg);
          transform-origin: center;
          animation: wave 2s ease-in-out infinite;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 shadow-sm z-10">
        <div className="w-40 h-16 relative">
          <Image src="" alt="Logo" layout="fill" objectFit="contain" />
        </div>
        <div className="flex space-x-4">
          <FiLinkedin className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <FiTwitter className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <RiTwitterXLine className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <h1 className="text-4xl font-bold text-[#4f89b7] mb-8">Choose Your Plan</h1>
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price={9.99}
            features={[
              "100 AI conversations/month",
              "Basic analytics",
              "Email support"
            ]}
            isPopular={false}
          />
          <PricingCard
            title="Pro"
            price={29.99}
            features={[
              "Unlimited AI conversations",
              "Advanced analytics",
              "Priority email support",
              "Custom AI training"
            ]}
            isPopular={true}
          />
          <PricingCard
            title="Enterprise"
            price={99.99}
            features={[
              "Unlimited AI conversations",
              "Advanced analytics",
              "24/7 phone support",
              "Custom AI training",
              "Dedicated account manager"
            ]}
            isPopular={false}
          />
        </div>
      </main>
      
      <footer className="bg-white bg-opacity-80 shadow-sm mt-8 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Terms & Conditions</a>
            <a href="#" className="text-[#4f89b7] hover:text-[#3a6d94]">Privacy Policy</a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <div className="w-20 h-8 relative">
              <Image src="" alt="Logo" layout="fill" objectFit="contain" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}