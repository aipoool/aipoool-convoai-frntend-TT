import { Suspense } from 'react'
import ChangePlanForm from './ChangePlanWiz'

export default function ChangePlanPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Change Plan</h1>
      <Suspense 
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading your plan details...</p>
          </div>
        }
      >
        <ChangePlanForm />
      </Suspense>
    </div>
  )
}