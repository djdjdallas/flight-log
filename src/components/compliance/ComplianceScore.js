'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Gauge } from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function ComplianceScore() {
  const [score, setScore] = useState(0)
  const [previousScore, setPreviousScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [trend, setTrend] = useState('stable')

  useEffect(() => {
    calculateScore()
  }, [])

  async function calculateScore() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get current score using our compliance checker
      const currentScore = await complianceChecker.calculateComplianceScore(user.id)
      
      // Get previous month's score for trend analysis
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      
      const { data: lastMonthFlights } = await supabase
        .from('flights')
        .select('compliance_status')
        .eq('pilot_id', user.id)
        .lte('start_time', lastMonth.toISOString())

      let previousScore = 100
      if (lastMonthFlights && lastMonthFlights.length > 0) {
        const compliantFlights = lastMonthFlights.filter(f => f.compliance_status === 'compliant').length
        previousScore = Math.round((compliantFlights / lastMonthFlights.length) * 100)
      }

      // Calculate trend
      const scoreDiff = currentScore - previousScore
      let trendStatus = 'stable'
      if (scoreDiff > 5) {
        trendStatus = 'improving'
      } else if (scoreDiff < -5) {
        trendStatus = 'declining'
      }

      setScore(currentScore)
      setPreviousScore(previousScore)
      setTrend(trendStatus)
    } catch (error) {
      console.error('Error calculating compliance score:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (score) => {
    if (score >= 95) return 'bg-green-600'
    if (score >= 80) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Gauge className="h-4 w-4 text-slate-600" />
    }
  }

  const getTrendMessage = () => {
    const diff = Math.abs(score - previousScore)
    switch (trend) {
      case 'improving':
        return `+${diff}% from last month`
      case 'declining':
        return `-${diff}% from last month`
      default:
        return 'Stable from last month'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="h-5 w-5 mr-2" />
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-16 bg-slate-200 rounded-full w-16 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gauge className="h-5 w-5 mr-2" />
          Compliance Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Circular Progress */}
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${score * 2.51} 251`}
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Details */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              {score >= 95 ? 'Excellent compliance' :
               score >= 80 ? 'Good compliance' :
               'Needs improvement'}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              {getTrendIcon()}
              <span className={
                trend === 'improving' ? 'text-green-600' :
                trend === 'declining' ? 'text-red-600' :
                'text-slate-600'
              }>
                {getTrendMessage()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to 100%</span>
              <span>{score}%</span>
            </div>
            <Progress 
              value={score} 
              className="h-2"
              // Note: You might need to add custom styling for progress color
            />
          </div>

          {/* Improvement Tips */}
          {score < 100 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-900 mb-2">Ways to Improve</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                {score < 95 && (
                  <li>• Ensure all flights have proper compliance verification</li>
                )}
                {score < 85 && (
                  <li>• Keep aircraft registrations and certificates current</li>
                )}
                {score < 75 && (
                  <li>• Verify Remote ID requirements are met</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}