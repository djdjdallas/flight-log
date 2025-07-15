'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  FileText,
  Plane,
  ArrowRight,
  Bell
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'
import Link from 'next/link'

export default function UpcomingRenewals() {
  const [renewals, setRenewals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingRenewals()
  }, [])

  async function fetchUpcomingRenewals() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Get active aircraft
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')

      const upcomingRenewals = []

      // Check Part 107 expiry
      if (profile?.pilot_certificate_expiry) {
        const part107Status = complianceChecker.checkPart107Expiry(profile)
        if (part107Status.daysRemaining <= 90) { // Show if expiring within 3 months
          upcomingRenewals.push({
            id: 'part107',
            type: 'Part 107 Certificate',
            item: 'Remote Pilot Certificate',
            expiryDate: profile.pilot_certificate_expiry,
            daysRemaining: part107Status.daysRemaining,
            severity: part107Status.severity,
            message: part107Status.message,
            icon: FileText,
            action: 'Renew Certificate',
            url: 'https://faasafety.gov/gslac/ALC/CourseLanding.aspx?cID=451'
          })
        }
      }

      // Check aircraft registrations
      aircraft?.forEach(ac => {
        if (ac.registration_expiry) {
          const regStatus = complianceChecker.checkRegistrationExpiry(ac)
          if (regStatus.daysRemaining <= 60) { // Show if expiring within 2 months
            upcomingRenewals.push({
              id: `aircraft-${ac.id}`,
              type: 'Aircraft Registration',
              item: `${ac.manufacturer} ${ac.model} (${ac.registration_number})`,
              expiryDate: ac.registration_expiry,
              daysRemaining: regStatus.daysRemaining,
              severity: regStatus.severity,
              message: regStatus.message,
              icon: Plane,
              action: 'Renew Registration',
              url: 'https://faadronezone.faa.gov/'
            })
          }
        }
      })

      // Sort by days remaining (most urgent first)
      upcomingRenewals.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))

      setRenewals(upcomingRenewals)
    } catch (error) {
      console.error('Error fetching upcoming renewals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const formatDaysRemaining = (days) => {
    if (days < 0) return 'Expired'
    if (days === 0) return 'Expires today'
    if (days === 1) return 'Expires tomorrow'
    if (days <= 7) return `${days} days`
    if (days <= 30) return `${Math.ceil(days / 7)} weeks`
    return `${Math.ceil(days / 30)} months`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-slate-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Upcoming Renewals
          </CardTitle>
          {renewals.length > 0 && (
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              {renewals.length} items
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renewals.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              All up to date!
            </h3>
            <p className="text-slate-600">
              No renewals needed in the next 90 days.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {renewals.map((renewal) => {
              const Icon = renewal.icon
              
              return (
                <div 
                  key={renewal.id} 
                  className={`p-4 border-2 rounded-lg ${getSeverityColor(renewal.severity)}`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-slate-900">
                          {renewal.type}
                        </h4>
                        {getSeverityIcon(renewal.severity)}
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-2">
                        {renewal.item}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className={
                            renewal.severity === 'error' ? 'text-red-600 font-medium' :
                            renewal.severity === 'warning' ? 'text-yellow-600 font-medium' :
                            'text-green-600'
                          }>
                            {formatDaysRemaining(renewal.daysRemaining)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-600 mt-2">
                        {renewal.message}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      <a 
                        href={renewal.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          {renewal.action}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add Calendar Reminder CTA */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Set up automatic reminders
                </span>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm">
                    Notification Settings
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}