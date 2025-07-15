import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FlightList from '@/components/flights/FlightList'
import FlightFilters from '@/components/flights/FlightFilters'
import AddFlightButton from '@/components/flights/AddFlightButton'

export default async function FlightsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flight Logs</h1>
            <p className="text-gray-600 mt-2">View and manage your flight history and compliance data</p>
          </div>
          <AddFlightButton />
        </div>

        {/* Filters */}
        <FlightFilters />

        {/* Flight List */}
        <FlightList />
      </div>
    </DashboardLayout>
  )
}