import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ComplianceOverview from '@/components/compliance/ComplianceOverview'
import ComplianceScore from '@/components/compliance/ComplianceScore'
import QuickStats from '@/components/compliance/QuickStats'
import ComplianceTimeline from '@/components/compliance/ComplianceTimeline'
import RecentViolations from '@/components/compliance/RecentViolations'

export default async function ComplianceDashboard() {
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
          <h1 className="text-3xl font-bold text-slate-900">Compliance Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor your regulatory compliance and identify potential issues</p>
        </div>

        {/* Compliance Overview */}
        <ComplianceOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Compliance Score */}
          <div className="lg:col-span-1">
            <ComplianceScore />
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2">
            <QuickStats />
          </div>
        </div>

        {/* Timeline and Violations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ComplianceTimeline />
          <RecentViolations />
        </div>
      </div>
    </DashboardLayout>
  )
}