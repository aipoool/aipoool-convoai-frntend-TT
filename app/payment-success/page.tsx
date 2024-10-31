import { Suspense } from 'react'
import PaymentSuccessContent from './PaymentSuccessContent'
import { Card } from "@/components/ui/card"

export default function PaymentSuccessPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Suspense
        fallback={
          <Card className="p-6">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}