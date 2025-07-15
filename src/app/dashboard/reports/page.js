import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ReportGenerator from '@/components/reports/ReportGenerator'
import ReportHistory from '@/components/reports/ReportHistory'

export default async function ReportsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download compliance reports for regulatory audits</p>
        </div>

        {/* Report Generator */}
        <ReportGenerator />

        {/* Report History */}
        <ReportHistory />
      </div>
    </DashboardLayout>
  )
}