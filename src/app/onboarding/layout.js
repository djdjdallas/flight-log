import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Plane } from 'lucide-react'

export default async function OnboardingLayout({ children }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center">
              <Plane className="h-7 w-7 text-white transform -rotate-45" />
            </div>
            <span className="ml-3 text-2xl font-bold text-slate-900">
              FlightLog Pro
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to FlightLog Pro
          </h1>
          <p className="mt-2 text-slate-600">
            Let's get you set up for compliant drone operations
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}