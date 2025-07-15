'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export default function FlightForm({ flight = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    aircraft_id: flight?.aircraft_id || '',
    battery_id: flight?.battery_id || '',
    flight_number: flight?.flight_number || '',
    start_time: flight?.start_time?.split('T')[0] || '',
    start_time_time: flight?.start_time?.split('T')[1]?.substring(0, 5) || '',
    end_time: flight?.end_time?.split('T')[0] || '',
    end_time_time: flight?.end_time?.split('T')[1]?.substring(0, 5) || '',
    takeoff_location_address: flight?.takeoff_location?.address || '',
    takeoff_lat: flight?.takeoff_location?.lat || '',
    takeoff_lng: flight?.takeoff_location?.lng || '',
    landing_location_address: flight?.landing_location?.address || '',
    landing_lat: flight?.landing_location?.lat || '',
    landing_lng: flight?.landing_location?.lng || '',
    max_altitude_ft: flight?.max_altitude_ft || '',
    max_speed_mph: flight?.max_speed_mph || '',
    purpose: flight?.purpose || '',
    notes: flight?.notes || '',
    remote_id_verified: flight?.remote_id_verified || false,
    airspace_authorization_id: flight?.airspace_authorization_id || ''
  })
  
  const [aircraft, setAircraft] = useState([])
  const [batteries, setBatteries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAircraft()
  }, [])

  useEffect(() => {
    if (formData.aircraft_id) {
      fetchBatteries(formData.aircraft_id)
    }
  }, [formData.aircraft_id])

  async function fetchAircraft() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('aircraft')
        .select('id, registration_number, manufacturer, model')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('manufacturer')

      setAircraft(data || [])
    } catch (error) {
      console.error('Error fetching aircraft:', error)
    }
  }

  async function fetchBatteries(aircraftId) {
    try {
      const { data } = await supabase
        .from('batteries')
        .select('id, serial_number, manufacturer, model')
        .eq('aircraft_id', aircraftId)
        .eq('status', 'active')
        .order('serial_number')

      setBatteries(data || [])
    } catch (error) {
      console.error('Error fetching batteries:', error)
    }
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateDuration = () => {
    if (formData.start_time && formData.start_time_time && formData.end_time && formData.end_time_time) {
      const startDateTime = new Date(`${formData.start_time}T${formData.start_time_time}`)
      const endDateTime = new Date(`${formData.end_time}T${formData.end_time_time}`)
      const durationMs = endDateTime - startDateTime
      return Math.round(durationMs / 1000 / 60) // minutes
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate required fields
      if (!formData.aircraft_id || !formData.start_time || !formData.start_time_time) {
        throw new Error('Aircraft, start date, and start time are required')
      }

      // Prepare data for submission
      const startDateTime = new Date(`${formData.start_time}T${formData.start_time_time}`)
      const endDateTime = formData.end_time && formData.end_time_time 
        ? new Date(`${formData.end_time}T${formData.end_time_time}`)
        : null

      const submitData = {
        aircraft_id: formData.aircraft_id,
        pilot_id: user.id,
        battery_id: formData.battery_id || null,
        flight_number: formData.flight_number || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime?.toISOString() || null,
        duration_minutes: calculateDuration(),
        takeoff_location: formData.takeoff_lat && formData.takeoff_lng ? {
          lat: parseFloat(formData.takeoff_lat),
          lng: parseFloat(formData.takeoff_lng),
          address: formData.takeoff_location_address || null
        } : null,
        landing_location: formData.landing_lat && formData.landing_lng ? {
          lat: parseFloat(formData.landing_lat),
          lng: parseFloat(formData.landing_lng),
          address: formData.landing_location_address || null
        } : null,
        max_altitude_ft: formData.max_altitude_ft ? parseInt(formData.max_altitude_ft) : null,
        max_speed_mph: formData.max_speed_mph ? parseFloat(formData.max_speed_mph) : null,
        purpose: formData.purpose || null,
        notes: formData.notes || null,
        remote_id_verified: formData.remote_id_verified,
        airspace_authorization_id: formData.airspace_authorization_id || null,
        compliance_status: 'pending',
        updated_at: new Date().toISOString()
      }

      let result
      if (flight) {
        // Update existing flight
        result = await supabase
          .from('flights')
          .update(submitData)
          .eq('id', flight.id)
          .eq('pilot_id', user.id)
      } else {
        // Create new flight
        result = await supabase
          .from('flights')
          .insert([submitData])
      }

      if (result.error) throw result.error

      onSuccess?.()
    } catch (err) {
      console.error('Error saving flight:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Flight Information */}
      <Card>
        <CardHeader>
          <CardTitle>Flight Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aircraft_id">Aircraft *</Label>
              <Select 
                value={formData.aircraft_id} 
                onValueChange={(value) => handleChange('aircraft_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aircraft" />
                </SelectTrigger>
                <SelectContent>
                  {aircraft.map((aircraft) => (
                    <SelectItem key={aircraft.id} value={aircraft.id}>
                      {aircraft.manufacturer} {aircraft.model} ({aircraft.registration_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="battery_id">Battery</Label>
              <Select 
                value={formData.battery_id} 
                onValueChange={(value) => handleChange('battery_id', value)}
                disabled={!formData.aircraft_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select battery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No battery selected</SelectItem>
                  {batteries.map((battery) => (
                    <SelectItem key={battery.id} value={battery.id}>
                      {battery.serial_number} ({battery.manufacturer})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="flight_number">Flight Number</Label>
              <Input
                id="flight_number"
                value={formData.flight_number}
                onChange={(e) => handleChange('flight_number', e.target.value)}
                placeholder="e.g., FLIGHT-001"
              />
            </div>

            <div>
              <Label htmlFor="airspace_authorization_id">LAANC Authorization ID</Label>
              <Input
                id="airspace_authorization_id"
                value={formData.airspace_authorization_id}
                onChange={(e) => handleChange('airspace_authorization_id', e.target.value)}
                placeholder="e.g., LAANC-12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Times */}
      <Card>
        <CardHeader>
          <CardTitle>Flight Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Date *</Label>
              <Input
                id="start_time"
                type="date"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="start_time_time">Start Time *</Label>
              <Input
                id="start_time_time"
                type="time"
                value={formData.start_time_time}
                onChange={(e) => handleChange('start_time_time', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Date</Label>
              <Input
                id="end_time"
                type="date"
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end_time_time">End Time</Label>
              <Input
                id="end_time_time"
                type="time"
                value={formData.end_time_time}
                onChange={(e) => handleChange('end_time_time', e.target.value)}
              />
            </div>
          </div>

          {calculateDuration() && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Calculated Duration:</strong> {calculateDuration()} minutes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="takeoff_location_address">Takeoff Location</Label>
              <Input
                id="takeoff_location_address"
                value={formData.takeoff_location_address}
                onChange={(e) => handleChange('takeoff_location_address', e.target.value)}
                placeholder="Address or description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="takeoff_lat">Takeoff Latitude</Label>
                <Input
                  id="takeoff_lat"
                  type="number"
                  step="any"
                  value={formData.takeoff_lat}
                  onChange={(e) => handleChange('takeoff_lat', e.target.value)}
                  placeholder="40.7128"
                />
              </div>
              <div>
                <Label htmlFor="takeoff_lng">Takeoff Longitude</Label>
                <Input
                  id="takeoff_lng"
                  type="number"
                  step="any"
                  value={formData.takeoff_lng}
                  onChange={(e) => handleChange('takeoff_lng', e.target.value)}
                  placeholder="-74.0060"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landing_location_address">Landing Location</Label>
              <Input
                id="landing_location_address"
                value={formData.landing_location_address}
                onChange={(e) => handleChange('landing_location_address', e.target.value)}
                placeholder="Address or description (leave blank if same as takeoff)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landing_lat">Landing Latitude</Label>
                <Input
                  id="landing_lat"
                  type="number"
                  step="any"
                  value={formData.landing_lat}
                  onChange={(e) => handleChange('landing_lat', e.target.value)}
                  placeholder="40.7128"
                />
              </div>
              <div>
                <Label htmlFor="landing_lng">Landing Longitude</Label>
                <Input
                  id="landing_lng"
                  type="number"
                  step="any"
                  value={formData.landing_lng}
                  onChange={(e) => handleChange('landing_lng', e.target.value)}
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Flight Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_altitude_ft">Maximum Altitude (ft)</Label>
              <Input
                id="max_altitude_ft"
                type="number"
                value={formData.max_altitude_ft}
                onChange={(e) => handleChange('max_altitude_ft', e.target.value)}
                placeholder="400"
              />
            </div>

            <div>
              <Label htmlFor="max_speed_mph">Maximum Speed (mph)</Label>
              <Input
                id="max_speed_mph"
                type="number"
                step="0.1"
                value={formData.max_speed_mph}
                onChange={(e) => handleChange('max_speed_mph', e.target.value)}
                placeholder="25.5"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remote_id_verified"
              checked={formData.remote_id_verified}
              onCheckedChange={(checked) => handleChange('remote_id_verified', checked)}
            />
            <Label htmlFor="remote_id_verified">
              Remote ID compliance verified
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="purpose">Purpose of Flight</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="e.g., Photography, Inspection, Training"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this flight..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : flight ? 'Update Flight' : 'Add Flight'}
        </Button>
      </div>
    </form>
  )
}