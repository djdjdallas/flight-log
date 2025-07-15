import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PreflightChecker from '@/components/preflight/PreflightChecker'

export default async function PreflightPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pre-flight Compliance Checker</h1>
          <p className="text-slate-600 mt-2">
            Verify your compliance status before each flight to ensure safe and legal operations
          </p>
        </div>

        {/* Pre-flight Checker */}
        <PreflightChecker />
      </div>
    </DashboardLayout>
  )
}