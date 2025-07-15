'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, Clock, Shield, User } from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function WelcomeCard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [complianceStatus, setComplianceStatus] = useState('loading')
  const [statusMessage, setStatusMessage] = useState('Checking compliance...')

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
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

      setProfile(profile)

      // Get quick compliance status
      const summary = await complianceChecker.getComplianceSummary(user.id)
      
      if (summary.upcomingExpirations.some(exp => exp.severity === 'error')) {
        setComplianceStatus('critical')
        setStatusMessage('Critical compliance issues need attention')
      } else if (summary.upcomingExpirations.some(exp => exp.severity === 'warning')) {
        setComplianceStatus('warning')
        setStatusMessage('Some renewals coming up soon')
      } else if (summary.score >= 95) {
        setComplianceStatus('excellent')
        setStatusMessage('Excellent compliance status')
      } else if (summary.score >= 80) {
        setComplianceStatus('good')
        setStatusMessage('Good compliance status')
      } else {
        setComplianceStatus('needs_improvement')
        setStatusMessage('Compliance needs improvement')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setComplianceStatus('error')
      setStatusMessage('Unable to check compliance')
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getStatusIcon = () => {
    switch (complianceStatus) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'critical':
      case 'needs_improvement':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'loading':
        return <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-slate-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusBadge = () => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      needs_improvement: 'bg-red-100 text-red-800',
      loading: 'bg-slate-100 text-slate-800',
      error: 'bg-slate-100 text-slate-800'
    }

    const labels = {
      excellent: 'Excellent',
      good: 'Good',
      warning: 'Attention Needed',
      critical: 'Critical',
      needs_improvement: 'Needs Work',
      loading: 'Checking...',
      error: 'Error'
    }

    return (
      <Badge className={variants[complianceStatus] || variants.error}>
        {labels[complianceStatus] || 'Unknown'}
      </Badge>
    )
  }

  const getBackgroundGradient = () => {
    switch (complianceStatus) {
      case 'excellent':
      case 'good':
        return 'bg-gradient-to-r from-green-50 to-emerald-50'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50'
      case 'critical':
      case 'needs_improvement':
        return 'bg-gradient-to-r from-red-50 to-rose-50'
      default:
        return 'bg-gradient-to-r from-slate-50 to-gray-50'
    }
  }

  return (
    <Card className={`border-0 shadow-lg ${getBackgroundGradient()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0] || 'Pilot'}!
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon()}
                <span className="text-slate-700">{statusMessage}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge()}
            {complianceStatus === 'excellent' && (
              <div className="flex items-center space-x-1 text-sm text-green-700">
                <Shield className="h-4 w-4" />
                <span>Fully Compliant</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {profile?.pilot_certificate_number ? '✓' : '–'}
            </div>
            <div className="text-xs text-slate-600">Part 107</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {complianceStatus === 'loading' ? '–' : '✓'}
            </div>
            <div className="text-xs text-slate-600">Remote ID</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {profile?.pilot_certificate_expiry ? '✓' : '–'}
            </div>
            <div className="text-xs text-slate-600">Current</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}