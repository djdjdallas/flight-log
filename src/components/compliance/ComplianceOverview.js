'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, Clock, Shield } from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function ComplianceOverview() {
  const [overallStatus, setOverallStatus] = useState('loading')
  const [statusMessage, setStatusMessage] = useState('Checking compliance...')
  const [criticalIssues, setCriticalIssues] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkOverallCompliance()
  }, [])

  async function checkOverallCompliance() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

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

      // Get recent flights
      const { data: flights } = await supabase
        .from('flights')
        .select('compliance_status')
        .eq('pilot_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10)

      const issues = []
      let hasErrors = false
      let hasWarnings = false

      // Check Part 107 expiry
      if (profile?.pilot_certificate_expiry) {
        const part107Status = complianceChecker.checkPart107Expiry(profile)
        if (part107Status.severity === 'error') {
          hasErrors = true
          issues.push({
            type: 'part107',
            message: part107Status.message,
            severity: 'error'
          })
        } else if (part107Status.severity === 'warning') {
          hasWarnings = true
          issues.push({
            type: 'part107',
            message: part107Status.message,
            severity: 'warning'
          })
        }
      }

      // Check aircraft compliance
      aircraft?.forEach(ac => {
        const regStatus = complianceChecker.checkRegistrationExpiry(ac)
        if (regStatus.severity === 'error') {
          hasErrors = true
          issues.push({
            type: 'registration',
            message: `${ac.manufacturer} ${ac.model}: ${regStatus.message}`,
            severity: 'error'
          })
        } else if (regStatus.severity === 'warning') {
          hasWarnings = true
          issues.push({
            type: 'registration',
            message: `${ac.manufacturer} ${ac.model}: ${regStatus.message}`,
            severity: 'warning'
          })
        }

        // Check Remote ID
        const remoteIdRequired = complianceChecker.checkRemoteIDRequirement(ac)
        if (remoteIdRequired && !ac.remote_id_serial) {
          hasErrors = true
          issues.push({
            type: 'remote_id',
            message: `${ac.manufacturer} ${ac.model}: Remote ID required but missing`,
            severity: 'error'
          })
        }
      })

      // Check recent flight compliance
      const nonCompliantFlights = flights?.filter(f => f.compliance_status === 'non_compliant').length || 0
      if (nonCompliantFlights > 0) {
        hasErrors = true
        issues.push({
          type: 'flights',
          message: `${nonCompliantFlights} non-compliant flights in recent history`,
          severity: 'error'
        })
      }

      // Determine overall status
      if (hasErrors) {
        setOverallStatus('non_compliant')
        setStatusMessage('Compliance issues require immediate attention')
      } else if (hasWarnings) {
        setOverallStatus('warning')
        setStatusMessage('Some items require attention soon')
      } else {
        setOverallStatus('compliant')
        setStatusMessage('All compliance requirements are met')
      }

      setCriticalIssues(issues.filter(i => i.severity === 'error'))
    } catch (error) {
      console.error('Error checking compliance:', error)
      setOverallStatus('error')
      setStatusMessage('Unable to check compliance status')
    }
  }

  const getStatusIcon = () => {
    switch (overallStatus) {
      case 'compliant':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'warning':
        return <Clock className="h-8 w-8 text-yellow-600" />
      case 'non_compliant':
        return <AlertTriangle className="h-8 w-8 text-red-600" />
      case 'loading':
        return <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-600" />
      default:
        return <AlertTriangle className="h-8 w-8 text-slate-400" />
    }
  }

  const getStatusBadge = () => {
    const variants = {
      compliant: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      non_compliant: 'bg-red-100 text-red-800',
      loading: 'bg-slate-100 text-slate-800',
      error: 'bg-slate-100 text-slate-800'
    }

    const labels = {
      compliant: 'Compliant',
      warning: 'Warning',
      non_compliant: 'Non-Compliant',
      loading: 'Checking...',
      error: 'Error'
    }

    return (
      <Badge className={variants[overallStatus] || variants.error}>
        {labels[overallStatus] || 'Unknown'}
      </Badge>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-white border-2">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Compliance Status</h2>
              <p className="text-slate-600">{statusMessage}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Issues Requiring Immediate Action
            </h3>
            <div className="space-y-3">
              {criticalIssues.map((issue, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{issue.message}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {issue.type === 'part107' && 'Update your Part 107 certificate'}
                      {issue.type === 'registration' && 'Renew aircraft registration'}
                      {issue.type === 'remote_id' && 'Install Remote ID equipment'}
                      {issue.type === 'flights' && 'Review flight compliance'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Protected Badge */}
        {overallStatus === 'compliant' && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-green-800 font-medium">
                Your operations are fully compliant with FAA regulations
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}