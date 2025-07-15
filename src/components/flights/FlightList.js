'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plane,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function FlightList({ filters = {} }) {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFlights()
  }, [filters])

  async function fetchFlights() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('flights')
        .select(`
          id,
          flight_number,
          start_time,
          end_time,
          duration_minutes,
          compliance_status,
          takeoff_location,
          landing_location,
          max_altitude_ft,
          max_speed_mph,
          purpose,
          remote_id_verified,
          aircraft:aircraft_id (
            id,
            registration_number,
            manufacturer,
            model
          ),
          flight_logs (
            id,
            import_source,
            import_status
          )
        `)
        .eq('pilot_id', user.id)
        .order('start_time', { ascending: false })

      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('start_time', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('start_time', filters.dateTo)
      }
      if (filters.aircraftId) {
        query = query.eq('aircraft_id', filters.aircraftId)
      }
      if (filters.complianceStatus) {
        query = query.eq('compliance_status', filters.complianceStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setFlights(data || [])
    } catch (err) {
      console.error('Error fetching flights:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this flight?')) return

    try {
      const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', id)

      if (error) throw error
      setFlights(prev => prev.filter(f => f.id !== id))
    } catch (error) {
      console.error('Error deleting flight:', error)
      alert('Failed to delete flight')
    }
  }

  const getComplianceBadge = (status, remoteIdVerified) => {
    const variants = {
      compliant: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      non_compliant: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock }
    }
    
    const variant = variants[status] || variants.pending
    const Icon = variant.icon
    
    return (
      <div className="flex items-center space-x-2">
        <Badge className={variant.color}>
          <Icon className="h-3 w-3 mr-1" />
          {status?.replace('_', ' ')}
        </Badge>
        {remoteIdVerified && (
          <Badge className="bg-blue-100 text-blue-800">
            Remote ID ✓
          </Badge>
        )}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatLocation = (location) => {
    if (!location || typeof location !== 'object') return 'Unknown'
    return location.address || `${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="bg-gray-200 h-6 w-1/3 rounded"></div>
                  <div className="bg-gray-200 h-6 w-20 rounded"></div>
                </div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Flights</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchFlights}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <Plane className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Flights Found</h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).length > 0 
              ? 'No flights match your current filters. Try adjusting your search criteria.'
              : 'Get started by logging your first flight or uploading flight data.'
            }
          </p>
          <div className="flex justify-center space-x-4">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Upload Flight Log
            </Button>
            <Button variant="outline">
              Manual Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <Card key={flight.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{flight.flight_number || `Flight ${flight.id.slice(0, 8)}`}</span>
                  {flight.flight_logs?.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {flight.flight_logs[0].import_source?.toUpperCase()}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {flight.aircraft?.manufacturer} {flight.aircraft?.model} ({flight.aircraft?.registration_number})
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getComplianceBadge(flight.compliance_status, flight.remote_id_verified)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Flight
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(flight.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Flight Time
                </div>
                <p className="font-medium">{formatDate(flight.start_time)}</p>
                {flight.duration_minutes && (
                  <p className="text-gray-600">{flight.duration_minutes} minutes</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  Takeoff Location
                </div>
                <p className="font-medium">{formatLocation(flight.takeoff_location)}</p>
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Plane className="h-4 w-4 mr-1" />
                  Flight Stats
                </div>
                <div className="space-y-1">
                  {flight.max_altitude_ft && (
                    <p className="font-medium">Max Alt: {flight.max_altitude_ft} ft</p>
                  )}
                  {flight.max_speed_mph && (
                    <p className="text-gray-600">Max Speed: {flight.max_speed_mph} mph</p>
                  )}
                </div>
              </div>
            </div>
            
            {flight.purpose && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <strong>Purpose:</strong> {flight.purpose}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {flights.length >= 20 && (
        <div className="text-center py-4">
          <Button variant="outline" onClick={fetchFlights}>
            Load More Flights
          </Button>
        </div>
      )}
    </div>
  )
}