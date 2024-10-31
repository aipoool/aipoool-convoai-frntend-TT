import { Suspense } from 'react'
import Image from 'next/image'
import { FiLinkedin, FiTwitter } from 'react-icons/fi'
import { RiTwitterXLine } from "react-icons/ri"
import ChangePlanWizardContent from './ChangePlanWiz'

export default function ChangePlanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-white bg-opacity-80 shadow-sm z-10">
        <Image src="/logo.svg" alt="ConvoAI Logo" width={100} height={40} />
        <div className="flex space-x-4">
          <FiLinkedin className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <FiTwitter className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
          <RiTwitterXLine className="text-[#4f89b7] text-2xl hover:text-[#3a6d94] transition-colors cursor-pointer" />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary">Change Plan</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <ChangePlanWizardContent />
          </Suspense>
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