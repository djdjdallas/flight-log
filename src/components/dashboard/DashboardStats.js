'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plane, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalFlightTime: 0,
    aircraftCount: 0,
    complianceRate: 0,
    loading: true
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch flight statistics
        const { data: flights } = await supabase
          .from('flights')
          .select('duration_minutes, compliance_status')
          .eq('pilot_id', user.id)

        // Fetch aircraft count
        const { data: aircraft } = await supabase
          .from('aircraft')
          .select('id')
          .eq('user_id', user.id)

        // Calculate stats
        const totalFlights = flights?.length || 0
        const totalFlightTime = flights?.reduce((acc, flight) => acc + (flight.duration_minutes || 0), 0) || 0
        const compliantFlights = flights?.filter(f => f.compliance_status === 'compliant').length || 0
        const complianceRate = totalFlights > 0 ? Math.round((compliantFlights / totalFlights) * 100) : 0

        setStats({
          totalFlights,
          totalFlightTime,
          aircraftCount: aircraft?.length || 0,
          complianceRate,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Flights',
      value: stats.totalFlights,
      icon: Plane,
      color: 'text-blue-600'
    },
    {
      title: 'Flight Hours',
      value: `${Math.round(stats.totalFlightTime / 60)}h`,
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Aircraft',
      value: stats.aircraftCount,
      icon: Plane,
      color: 'text-purple-600'
    },
    {
      title: 'Compliance Rate',
      value: `${stats.complianceRate}%`,
      icon: stats.complianceRate >= 95 ? CheckCircle : AlertTriangle,
      color: stats.complianceRate >= 95 ? 'text-green-600' : 'text-yellow-600'
    }
  ]

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-6 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}