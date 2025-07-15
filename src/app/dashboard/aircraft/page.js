import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AircraftList from '@/components/aircraft/AircraftList'
import AddAircraftButton from '@/components/aircraft/AddAircraftButton'

export default async function AircraftPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Aircraft</h1>
            <p className="text-gray-600 mt-2">Manage your drone fleet and Remote ID compliance</p>
          </div>
          <AddAircraftButton />
        </div>

        {/* Aircraft List */}
        <AircraftList />
      </div>
    </DashboardLayout>
  )
}