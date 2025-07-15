'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Plane,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function FlightStats() {
  const [stats, setStats] = useState({
    thisMonth: {
      flights: 0,
      hours: 0,
      compliantFlights: 0,
      complianceRate: 0
    },
    lastMonth: {
      flights: 0,
      hours: 0
    },
    dailyData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlightStats()
  }, [])

  async function fetchFlightStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get this month's start
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      
      // Get last month's start
      const lastMonth = new Date(thisMonth)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      // Get this month's flights
      const { data: thisMonthFlights } = await supabase
        .from('flights')
        .select('start_time, duration_minutes, compliance_status')
        .eq('pilot_id', user.id)
        .gte('start_time', thisMonth.toISOString())

      // Get last month's flights for comparison
      const { data: lastMonthFlights } = await supabase
        .from('flights')
        .select('start_time, duration_minutes, compliance_status')
        .eq('pilot_id', user.id)
        .gte('start_time', lastMonth.toISOString())
        .lt('start_time', thisMonth.toISOString())

      // Calculate this month stats
      const thisMonthStats = {
        flights: thisMonthFlights?.length || 0,
        hours: (thisMonthFlights?.reduce((sum, f) => sum + (f.duration_minutes || 0), 0) || 0) / 60,
        compliantFlights: thisMonthFlights?.filter(f => f.compliance_status === 'compliant').length || 0,
        complianceRate: thisMonthFlights?.length > 0 ? 
          (thisMonthFlights.filter(f => f.compliance_status === 'compliant').length / thisMonthFlights.length) * 100 : 0
      }

      // Calculate last month stats
      const lastMonthStats = {
        flights: lastMonthFlights?.length || 0,
        hours: (lastMonthFlights?.reduce((sum, f) => sum + (f.duration_minutes || 0), 0) || 0) / 60
      }

      // Create daily data for this month
      const dailyData = []
      const daysInMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0).getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayFlights = thisMonthFlights?.filter(f => {
          const flightDate = new Date(f.start_time)
          return flightDate.getDate() === day
        }) || []
        
        if (dayFlights.length > 0) {
          dailyData.push({
            day: day,
            flights: dayFlights.length,
            hours: dayFlights.reduce((sum, f) => sum + (f.duration_minutes || 0), 0) / 60
          })
        }
      }

      setStats({
        thisMonth: thisMonthStats,
        lastMonth: lastMonthStats,
        dailyData
      })
    } catch (error) {
      console.error('Error fetching flight stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const flightChange = getPercentageChange(stats.thisMonth.flights, stats.lastMonth.flights)
  const hoursChange = getPercentageChange(stats.thisMonth.hours, stats.lastMonth.hours)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            This Month's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="h-48 bg-slate-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          This Month's Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Plane className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Flights</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {stats.thisMonth.flights}
            </div>
            <div className="text-xs text-blue-700">
              {flightChange > 0 ? '+' : ''}{flightChange.toFixed(0)}% from last month
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Hours</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {stats.thisMonth.hours.toFixed(1)}
            </div>
            <div className="text-xs text-green-700">
              {hoursChange > 0 ? '+' : ''}{hoursChange.toFixed(0)}% from last month
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Compliant</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {stats.thisMonth.compliantFlights}
            </div>
            <div className="text-xs text-purple-700">
              {stats.thisMonth.complianceRate.toFixed(0)}% compliance rate
            </div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Avg per Day</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {stats.thisMonth.flights > 0 ? 
                (stats.thisMonth.flights / new Date().getDate()).toFixed(1) : 
                '0.0'
              }
            </div>
            <div className="text-xs text-orange-700">
              flights per day
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        {stats.dailyData.length > 0 ? (
          <div className="h-48">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Daily Activity</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'flights' ? `${value} flights` : `${value.toFixed(1)} hours`,
                    name === 'flights' ? 'Flights' : 'Hours'
                  ]}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Bar dataKey="flights" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <Plane className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No flights this month yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}