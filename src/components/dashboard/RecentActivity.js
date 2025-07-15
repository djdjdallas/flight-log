'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plane, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default function RecentActivity() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentFlights()
  }, [])

  async function fetchRecentFlights() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: flights, error } = await supabase
        .from('flights')
        .select(`
          id,
          start_time,
          duration_minutes,
          compliance_status,
          purpose,
          takeoff_location,
          max_altitude_ft,
          aircraft:aircraft_id (
            manufacturer,
            model,
            registration_number
          )
        `)
        .eq('pilot_id', user.id)
        .order('start_time', { ascending: false })
        .limit(5)

      if (error) throw error
      setFlights(flights || [])
    } catch (error) {
      console.error('Error fetching recent flights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getComplianceBadge = (status) => {
    const variants = {
      compliant: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      non_compliant: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock }
    }
    
    const variant = variants[status] || variants.pending
    const Icon = variant.icon
    
    return (
      <Badge className={variant.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status?.replace('_', ' ') || 'pending'}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatLocation = (location) => {
    if (!location || typeof location !== 'object') return 'Unknown location'
    if (location.address) return location.address
    if (location.lat && location.lng) {
      return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    }
    return 'Unknown location'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 py-3">
                <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
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
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
          <Link href="/dashboard/flights">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {flights.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No flights yet</h3>
            <p className="text-slate-600 mb-6">
              Upload your first flight log or add a manual entry to get started.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard/flights?action=upload">
                <Button>
                  Upload Flight Log
                </Button>
              </Link>
              <Link href="/dashboard/flights?action=manual">
                <Button variant="outline">
                  Manual Entry
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                {/* Aircraft Icon */}
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Plane className="h-5 w-5 text-slate-600" />
                </div>

                {/* Flight Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {flight.aircraft?.manufacturer} {flight.aircraft?.model}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {flight.aircraft?.registration_number}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(flight.start_time)}</span>
                    </div>
                    
                    {flight.duration_minutes && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{flight.duration_minutes}m</span>
                      </div>
                    )}
                    
                    {flight.max_altitude_ft && (
                      <div className="flex items-center space-x-1">
                        <span>Alt: {flight.max_altitude_ft}ft</span>
                      </div>
                    )}
                  </div>

                  {flight.takeoff_location && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500 truncate">
                        {formatLocation(flight.takeoff_location)}
                      </span>
                    </div>
                  )}

                  {flight.purpose && (
                    <div className="mt-1">
                      <span className="text-xs text-slate-600 italic">
                        "{flight.purpose}"
                      </span>
                    </div>
                  )}
                </div>

                {/* Compliance Status */}
                <div className="flex flex-col items-end space-y-2">
                  {getComplianceBadge(flight.compliance_status)}
                  <Link href={`/dashboard/flights/${flight.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Showing {flights.length} recent flights
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-green-600">
                    {flights.filter(f => f.compliance_status === 'compliant').length} compliant
                  </span>
                  <span className="text-red-600">
                    {flights.filter(f => f.compliance_status === 'non_compliant').length} non-compliant
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}