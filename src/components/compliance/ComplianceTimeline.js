'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

export default function ComplianceTimeline() {
  const [timelineData, setTimelineData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimelineData()
  }, [])

  async function fetchTimelineData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get flights from the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: flights } = await supabase
        .from('flights')
        .select(`
          id,
          start_time,
          compliance_status,
          aircraft:aircraft_id (
            manufacturer,
            model,
            registration_number
          )
        `)
        .eq('pilot_id', user.id)
        .gte('start_time', thirtyDaysAgo.toISOString())
        .order('start_time', { ascending: false })

      // Create daily compliance summary
      const dailyData = {}
      
      flights?.forEach(flight => {
        const date = new Date(flight.start_time).toISOString().split('T')[0]
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            flights: [],
            compliant: 0,
            nonCompliant: 0,
            pending: 0
          }
        }
        
        dailyData[date].flights.push(flight)
        
        if (flight.compliance_status === 'compliant') {
          dailyData[date].compliant++
        } else if (flight.compliance_status === 'non_compliant') {
          dailyData[date].nonCompliant++
        } else {
          dailyData[date].pending++
        }
      })

      // Convert to array and sort by date
      const timeline = Object.values(dailyData).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )

      setTimelineData(timeline)
    } catch (error) {
      console.error('Error fetching timeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (compliant, nonCompliant, pending) => {
    if (nonCompliant > 0) return 'bg-red-500'
    if (pending > 0) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusIcon = (compliant, nonCompliant, pending) => {
    if (nonCompliant > 0) return <AlertTriangle className="h-3 w-3 text-white" />
    if (pending > 0) return <Clock className="h-3 w-3 text-white" />
    return <CheckCircle className="h-3 w-3 text-white" />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Compliance Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
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
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Compliance Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineData.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No flights in the last 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timelineData.map((day, index) => (
              <div key={day.date} className="flex items-start space-x-4">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    getStatusColor(day.compliant, day.nonCompliant, day.pending)
                  }`}>
                    {getStatusIcon(day.compliant, day.nonCompliant, day.pending)}
                  </div>
                  {index < timelineData.length - 1 && (
                    <div className="absolute top-6 left-3 w-0.5 h-8 bg-slate-200"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(day.date)}
                    </p>
                    <div className="flex items-center space-x-2">
                      {day.compliant > 0 && (
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {day.compliant} compliant
                        </Badge>
                      )}
                      {day.nonCompliant > 0 && (
                        <Badge variant="outline" className="text-red-700 border-red-300">
                          {day.nonCompliant} non-compliant
                        </Badge>
                      )}
                      {day.pending > 0 && (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          {day.pending} pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {day.flights.slice(0, 3).map(flight => (
                      <p key={flight.id} className="text-xs text-slate-600">
                        {flight.aircraft?.manufacturer} {flight.aircraft?.model} 
                        ({flight.aircraft?.registration_number})
                      </p>
                    ))}
                    {day.flights.length > 3 && (
                      <p className="text-xs text-slate-500">
                        +{day.flights.length - 3} more flights
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* View More */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-slate-500">
                Showing last 30 days of flight activity
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}