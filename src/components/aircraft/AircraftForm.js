'use client'
import { useState } from 'react'
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

const manufacturers = [
  'DJI', 'Autel', 'Parrot', 'Yuneec', 'Skydio', 'Holy Stone', 'Hubsan', 'Other'
]

export default function AircraftForm({ aircraft = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    registration_number: aircraft?.registration_number || '',
    registration_expiry: aircraft?.registration_expiry || '',
    manufacturer: aircraft?.manufacturer || '',
    model: aircraft?.model || '',
    serial_number: aircraft?.serial_number || '',
    remote_id_serial: aircraft?.remote_id_serial || '',
    remote_id_type: aircraft?.remote_id_type || 'standard',
    weight_lbs: aircraft?.weight_lbs || '',
    purchase_date: aircraft?.purchase_date || '',
    status: aircraft?.status || 'active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Prepare data for submission
      const submitData = {
        ...formData,
        user_id: user.id,
        weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs) : null,
        purchase_date: formData.purchase_date || null,
        registration_expiry: formData.registration_expiry || null,
        updated_at: new Date().toISOString()
      }

      let result
      if (aircraft) {
        // Update existing aircraft
        result = await supabase
          .from('aircraft')
          .update(submitData)
          .eq('id', aircraft.id)
          .eq('user_id', user.id)
      } else {
        // Create new aircraft
        result = await supabase
          .from('aircraft')
          .insert([submitData])
      }

      if (result.error) throw result.error

      onSuccess?.()
    } catch (err) {
      console.error('Error saving aircraft:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="registration_number">Registration Number *</Label>
          <Input
            id="registration_number"
            value={formData.registration_number}
            onChange={(e) => handleChange('registration_number', e.target.value)}
            placeholder="e.g., FA32ABCD1234"
            required
          />
          <p className="text-xs text-gray-600 mt-1">
            FAA Registration Number (if required)
          </p>
        </div>

        <div>
          <Label htmlFor="registration_expiry">Registration Expiry</Label>
          <Input
            id="registration_expiry"
            type="date"
            value={formData.registration_expiry}
            onChange={(e) => handleChange('registration_expiry', e.target.value)}
          />
          <p className="text-xs text-gray-600 mt-1">
            When your FAA registration expires
          </p>
        </div>

        <div>
          <Label htmlFor="manufacturer">Manufacturer *</Label>
          <Select 
            value={formData.manufacturer} 
            onValueChange={(value) => handleChange('manufacturer', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((mfg) => (
                <SelectItem key={mfg} value={mfg}>
                  {mfg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="e.g., Mavic 3, Phantom 4"
            required
          />
        </div>

        <div>
          <Label htmlFor="serial_number">Serial Number</Label>
          <Input
            id="serial_number"
            value={formData.serial_number}
            onChange={(e) => handleChange('serial_number', e.target.value)}
            placeholder="Aircraft serial number"
          />
        </div>

        <div>
          <Label htmlFor="remote_id_serial">Remote ID Serial</Label>
          <Input
            id="remote_id_serial"
            value={formData.remote_id_serial}
            onChange={(e) => handleChange('remote_id_serial', e.target.value)}
            placeholder="Remote ID module serial"
          />
          <p className="text-xs text-gray-600 mt-1">
            Required for aircraft over 0.55 lbs (250g)
          </p>
        </div>

        <div>
          <Label htmlFor="remote_id_type">Remote ID Type</Label>
          <Select 
            value={formData.remote_id_type} 
            onValueChange={(value) => handleChange('remote_id_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Remote ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Remote ID</SelectItem>
              <SelectItem value="broadcast">Broadcast Module</SelectItem>
              <SelectItem value="network">Network Remote ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="weight_lbs">Weight (lbs)</Label>
          <Input
            id="weight_lbs"
            type="number"
            step="0.1"
            value={formData.weight_lbs}
            onChange={(e) => handleChange('weight_lbs', e.target.value)}
            placeholder="2.5"
          />
        </div>

        <div>
          <Label htmlFor="purchase_date">Purchase Date</Label>
          <Input
            id="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={(e) => handleChange('purchase_date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {loading ? 'Saving...' : aircraft ? 'Update Aircraft' : 'Add Aircraft'}
        </Button>
      </div>
    </form>
  )
}