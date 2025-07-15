'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  FileText, 
  Clock,
  ExternalLink,
  Filter
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function RecentViolations() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'high', 'medium', 'low'

  useEffect(() => {
    fetchViolations()
  }, [])

  async function fetchViolations() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get recent flights with compliance issues
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: flights } = await supabase
        .from('flights')
        .select(`
          id,
          start_time,
          compliance_status,
          remote_id_verified,
          max_altitude_ft,
          purpose,
          aircraft:aircraft_id (
            id,
            manufacturer,
            model,
            registration_number,
            weight_lbs,
            remote_id_serial,
            registration_expiry
          )
        `)
        .eq('pilot_id', user.id)
        .gte('start_time', thirtyDaysAgo.toISOString())
        .order('start_time', { ascending: false })

      // Get user profile for Part 107 checks
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('pilot_certificate_expiry')
        .eq('id', user.id)
        .single()

      // Get compliance checks from database
      const { data: complianceChecks } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      const allViolations = []

      // Process flights for violations
      for (const flight of flights || []) {
        if (flight.compliance_status === 'non_compliant' || flight.compliance_status === 'warning') {
          const flightViolations = await complianceChecker.getComplianceViolations(flight)
          
          flightViolations.forEach(violation => {
            allViolations.push({
              id: `flight-${flight.id}-${violation.type}`,
              type: violation.type,
              severity: violation.severity,
              message: violation.message,
              date: flight.start_time,
              source: 'flight',
              sourceId: flight.id,
              aircraft: flight.aircraft,
              resolved: false,
              category: getViolationCategory(violation.type)
            })
          })
        }
      }

      // Process database compliance checks
      complianceChecks?.forEach(check => {
        if (check.status === 'fail') {
          allViolations.push({
            id: check.id,
            type: check.check_type,
            severity: check.details?.severity || 'error',
            message: check.violation_message,
            date: check.created_at,
            source: 'compliance_check',
            sourceId: check.id,
            aircraft: null,
            resolved: false,
            category: getViolationCategory(check.check_type)
          })
        }
      })

      // Check for current expiry violations
      if (profile?.pilot_certificate_expiry) {
        const part107Status = complianceChecker.checkPart107Expiry(profile)
        if (part107Status.severity === 'error') {
          allViolations.push({
            id: 'part107-expiry',
            type: 'part107',
            severity: 'error',
            message: part107Status.message,
            date: new Date().toISOString(),
            source: 'certificate',
            sourceId: 'part107',
            aircraft: null,
            resolved: false,
            category: 'Certification'
          })
        }
      }

      // Sort by date (newest first)
      allViolations.sort((a, b) => new Date(b.date) - new Date(a.date))

      setViolations(allViolations)
    } catch (error) {
      console.error('Error fetching violations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getViolationCategory = (type) => {
    switch (type) {
      case 'remote_id': return 'Remote ID'
      case 'registration': return 'Registration'
      case 'part107': return 'Certification'
      case 'weight': return 'Weight Limits'
      case 'airspace': return 'Airspace'
      case 'altitude': return 'Altitude'
      default: return 'Other'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <CheckCircle className="h-4 w-4 text-slate-600" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const filteredViolations = violations.filter(violation => {
    if (filter === 'all') return true
    if (filter === 'high') return violation.severity === 'error'
    if (filter === 'medium') return violation.severity === 'warning'
    if (filter === 'low') return violation.severity === 'info'
    return true
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent Violations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-4 w-4 bg-slate-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
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
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent Violations
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High
            </Button>
            <Button
              variant={filter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('medium')}
            >
              Medium
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredViolations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">No recent violations</p>
            <p className="text-sm text-slate-500">
              {filter === 'all' ? 
                'Your operations are compliant' : 
                `No ${filter} severity violations found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredViolations.slice(0, 10).map((violation) => (
              <div key={violation.id} className="border-l-4 border-l-red-500 pl-4 py-3 bg-slate-50 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSeverityIcon(violation.severity)}
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {violation.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {violation.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{formatDate(violation.date)}</span>
                      {violation.aircraft && (
                        <span>
                          {violation.aircraft.manufacturer} {violation.aircraft.model} 
                          ({violation.aircraft.registration_number})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {violation.source === 'flight' && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredViolations.length > 10 && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-slate-500">
                  Showing 10 of {filteredViolations.length} violations
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View All Violations
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}