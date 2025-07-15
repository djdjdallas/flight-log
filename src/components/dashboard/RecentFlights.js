'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default function RecentFlights() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentFlights() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: flights } = await supabase
          .from('flights')
          .select(`
            id,
            start_time,
            duration_minutes,
            compliance_status,
            aircraft:aircraft_id (
              registration_number,
              manufacturer,
              model
            )
          `)
          .eq('pilot_id', user.id)
          .order('start_time', { ascending: false })
          .limit(5)

        setFlights(flights || [])
      } catch (error) {
        console.error('Error fetching recent flights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentFlights()
  }, [])

  const getComplianceBadge = (status) => {
    const variants = {
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800'
    }
    
    return variants[status] || variants.pending
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
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
        <CardTitle>Recent Flights</CardTitle>
      </CardHeader>
      <CardContent>
        {flights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No flights logged yet</p>
            <Link href="/dashboard/flights" className="text-blue-600 hover:text-blue-500">
              Log your first flight →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div key={flight.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {flight.aircraft?.manufacturer} {flight.aircraft?.model}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {flight.aircraft?.registration_number}
                    </p>
                  </div>
                  <Badge className={getComplianceBadge(flight.compliance_status)}>
                    {flight.compliance_status?.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(flight.start_time)}
                  </div>
                  {flight.duration_minutes && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {flight.duration_minutes}m
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Link 
                href="/dashboard/flights"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                View all flights →
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}