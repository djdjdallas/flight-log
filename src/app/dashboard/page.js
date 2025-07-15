import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import QuickActions from '@/components/dashboard/QuickActions'
import ComplianceSummaryCard from '@/components/dashboard/ComplianceSummaryCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import UpcomingRenewals from '@/components/dashboard/UpcomingRenewals'
import FlightStats from '@/components/dashboard/FlightStats'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeCard />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Compliance Summary */}
          <div className="lg:col-span-1">
            <ComplianceSummaryCard />
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Renewals and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingRenewals />
          <FlightStats />
        </div>
      </div>
    </DashboardLayout>
  )
}