'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plane, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Shield
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function QuickStats() {
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalHours: 0,
    thisMonthFlights: 0,
    thisMonthHours: 0,
    nextExpiry: null,
    recentViolations: 0,
    complianceRate: 100
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all flights
      const { data: flights } = await supabase
        .from('flights')
        .select('start_time, duration_minutes, compliance_status')
        .eq('pilot_id', user.id)
        .order('start_time', { ascending: false })

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('pilot_certificate_expiry')
        .eq('id', user.id)
        .single()

      // Get aircraft
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('registration_expiry, manufacturer, model')
        .eq('user_id', user.id)
        .eq('status', 'active')

      // Calculate stats
      const totalFlights = flights?.length || 0
      const totalHours = flights?.reduce((sum, flight) => sum + (flight.duration_minutes || 0), 0) / 60 || 0

      // This month's flights
      const thisMonth = new Date()
      thisMonth.setDate(1)
      const thisMonthFlights = flights?.filter(f => new Date(f.start_time) >= thisMonth) || []
      const thisMonthFlightsCount = thisMonthFlights.length
      const thisMonthHours = thisMonthFlights.reduce((sum, flight) => sum + (flight.duration_minutes || 0), 0) / 60

      // Recent violations (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentViolations = flights?.filter(f => 
        new Date(f.start_time) >= thirtyDaysAgo && 
        f.compliance_status === 'non_compliant'
      ).length || 0

      // Compliance rate
      const compliantFlights = flights?.filter(f => f.compliance_status === 'compliant').length || 0
      const complianceRate = totalFlights > 0 ? Math.round((compliantFlights / totalFlights) * 100) : 100

      // Find next expiry
      const expiryDates = []
      
      // Part 107 expiry
      if (profile?.pilot_certificate_expiry) {
        const part107Status = complianceChecker.checkPart107Expiry(profile)
        expiryDates.push({
          type: 'Part 107 Certificate',
          date: profile.pilot_certificate_expiry,
          daysRemaining: part107Status.daysRemaining,
          severity: part107Status.severity
        })
      }

      // Aircraft registration expiries
      aircraft?.forEach(ac => {
        if (ac.registration_expiry) {
          const regStatus = complianceChecker.checkRegistrationExpiry(ac)
          expiryDates.push({
            type: `${ac.manufacturer} ${ac.model} Registration`,
            date: ac.registration_expiry,
            daysRemaining: regStatus.daysRemaining,
            severity: regStatus.severity
          })
        }
      })

      // Sort by days remaining
      expiryDates.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
      const nextExpiry = expiryDates[0] || null

      setStats({
        totalFlights,
        totalHours,
        thisMonthFlights: thisMonthFlightsCount,
        thisMonthHours,
        nextExpiry,
        recentViolations,
        complianceRate
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getExpiryBadge = (severity) => {
    const variants = {
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800'
    }
    return variants[severity] || variants.success
  }

  const formatHours = (hours) => {
    return hours.toFixed(1)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Flights */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Plane className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Total Flights</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalFlights}</div>
            <div className="text-xs text-slate-500">
              {formatHours(stats.totalHours)} hours total
            </div>
          </div>

          {/* This Month */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">This Month</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.thisMonthFlights}</div>
            <div className="text-xs text-slate-500">
              {formatHours(stats.thisMonthHours)} hours
            </div>
          </div>

          {/* Compliance Rate */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Compliance Rate</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.complianceRate}%</div>
            <div className="text-xs text-slate-500">
              {stats.recentViolations > 0 ? (
                <span className="text-red-600">
                  {stats.recentViolations} recent violations
                </span>
              ) : (
                <span className="text-green-600">No recent violations</span>
              )}
            </div>
          </div>

          {/* Next Expiry */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Next Expiry</span>
            </div>
            {stats.nextExpiry ? (
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.nextExpiry.daysRemaining > 0 ? 
                    `${stats.nextExpiry.daysRemaining}d` : 
                    'Expired'
                  }
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-slate-500">{stats.nextExpiry.type}</div>
                  <Badge className={getExpiryBadge(stats.nextExpiry.severity)}>
                    {stats.nextExpiry.severity === 'error' ? 'Action Required' :
                     stats.nextExpiry.severity === 'warning' ? 'Expiring Soon' :
                     'Valid'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-slate-900">∞</div>
                <div className="text-xs text-slate-500">No expiry dates set</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}