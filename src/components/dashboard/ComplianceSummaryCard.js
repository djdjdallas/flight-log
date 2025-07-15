'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'
import Link from 'next/link'

export default function ComplianceSummaryCard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trend, setTrend] = useState('stable')

  useEffect(() => {
    fetchComplianceSummary()
  }, [])

  async function fetchComplianceSummary() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const summary = await complianceChecker.getComplianceSummary(user.id)
      setSummary(summary)

      // Calculate trend (simplified)
      if (summary.score >= 95) {
        setTrend('excellent')
      } else if (summary.score >= 80) {
        setTrend('good')
      } else {
        setTrend('needs_work')
      }
    } catch (error) {
      console.error('Error fetching compliance summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score) => {
    if (score >= 95) return 'bg-green-50 border-green-200'
    if (score >= 80) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'excellent':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'good':
        return <Minus className="h-4 w-4 text-yellow-600" />
      case 'needs_work':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusMessage = (score) => {
    if (score >= 95) return 'Excellent compliance! Keep it up.'
    if (score >= 80) return 'Good compliance with room for improvement.'
    return 'Compliance needs attention.'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-16 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Unable to load compliance data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className={`p-6 rounded-lg border-2 ${getScoreBackground(summary.score)}`}>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(summary.score)} mb-2`}>
              {summary.score}%
            </div>
            <p className="text-sm text-slate-600 mb-4">
              {getStatusMessage(summary.score)}
            </p>
            <div className="flex items-center justify-center space-x-2">
              {getTrendIcon()}
              <span className="text-sm text-slate-600">
                {summary.totalFlights} flights tracked
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to 100%</span>
            <span>{summary.score}%</span>
          </div>
          <Progress value={summary.score} className="h-3" />
        </div>

        {/* Flight Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {summary.compliantFlights}
            </div>
            <div className="text-xs text-slate-600">Compliant</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {summary.nonCompliantFlights}
            </div>
            <div className="text-xs text-slate-600">Non-Compliant</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {summary.pendingFlights}
            </div>
            <div className="text-xs text-slate-600">Pending</div>
          </div>
        </div>

        {/* Critical Issues */}
        {summary.upcomingExpirations.filter(exp => exp.severity === 'error').length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Critical Issues
                </h4>
                <p className="text-sm text-red-700">
                  {summary.upcomingExpirations.filter(exp => exp.severity === 'error').length} items need immediate attention
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href="/dashboard/compliance">
          <Button className="w-full">
            View Full Compliance Report
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>

        {/* Last Update */}
        <div className="text-center text-xs text-slate-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}