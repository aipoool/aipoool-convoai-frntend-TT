'use client'

import { Button } from "@/components/ui/button"
import { FiLinkedin, FiTwitter, FiMail, FiRefreshCw } from 'react-icons/fi'
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

    const gridSize = 50
    const columns = Math.ceil(windowSize.width / gridSize)
    const rows = Math.ceil(windowSize.height / gridSize)

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {[...Array(rows)].map((_, rowIndex) => (
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
                ))}
                {[...Array(columns)].map((_, colIndex) => (
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
                ))}
            </svg>
        </div>
    )
}

export default function LoginFailedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <GridBackground />

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
      
      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#4f89b7]">Login Failed</h2>
              <p className="mt-2 text-gray-600">We couldn't log you in. Please try again or contact support.</p>
            </div>
            
            <div className="space-y-4">
              <motion.button
                className="w-full py-2 px-4 bg-white text-[#4f89b7] border border-[#4f89b7] rounded-md shadow-lg flex items-center justify-center space-x-2 hover:bg-[#f0f7fc] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMail className="text-xl" />
                <span>Write to Developer</span>
              </motion.button>
              
              <motion.button
                className="w-full py-2 px-4 bg-white text-[#4f89b7] border border-[#4f89b7] rounded-md shadow-lg flex items-center justify-center space-x-2 hover:bg-[#f0f7fc] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="text-xl" />
                <span>Retry Login</span>
              </motion.button>
            </div>
          </div>
          
          <motion.div 
            className="hidden md:flex w-1/2 justify-center items-center"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Image 
              src="/login_failed.png" 
              alt="3D character"
              width={400}
              height={400}
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
            />
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
            <div className="w-20 h-8 relative">
              <Image src="" alt="Logo" layout="fill" objectFit="contain" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}