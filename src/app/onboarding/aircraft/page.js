'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import OnboardingProgress from '@/components/onboarding/OnboardingProgress'
import { ArrowRight, ArrowLeft, AlertCircle, Info } from 'lucide-react'

export default function AircraftSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    registration_number: '',
    registration_expiry: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    weight_lbs: '',
    remote_id_serial: '',
    remote_id_type: 'standard'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Check if user has completed profile step
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, pilot_certificate_number')
          .eq('id', user.id)
          .single()

        if (!profile?.full_name || !profile?.pilot_certificate_number) {
          // Redirect back to profile if not completed
          router.push('/onboarding/profile')
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    handleChange(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) throw new Error('User not found')

      // Validate required fields
      if (!formData.registration_number.trim()) {
        throw new Error('Registration number is required')
      }

      if (!formData.manufacturer.trim()) {
        throw new Error('Manufacturer is required')
      }

      if (!formData.model.trim()) {
        throw new Error('Model is required')
      }

      if (!formData.weight_lbs || parseFloat(formData.weight_lbs) <= 0) {
        throw new Error('Valid weight is required')
      }

      // Validate registration expiry if provided
      if (formData.registration_expiry) {
        const expiryDate = new Date(formData.registration_expiry)
        const today = new Date()
        if (expiryDate <= today) {
          throw new Error('Registration expiry date must be in the future')
        }
      }

      // Check if Remote ID is required
      const weightLbs = parseFloat(formData.weight_lbs)
      const remoteIdRequired = weightLbs > 0.55 // 250g threshold

      if (remoteIdRequired && !formData.remote_id_serial.trim()) {
        throw new Error('Remote ID serial number is required for aircraft over 0.55 lbs (250g)')
      }

      // Insert aircraft
      const { error: insertError } = await supabase
        .from('aircraft')
        .insert({
          user_id: user.id,
          registration_number: formData.registration_number.trim().toUpperCase(),
          registration_expiry: formData.registration_expiry || null,
          manufacturer: formData.manufacturer.trim(),
          model: formData.model.trim(),
          serial_number: formData.serial_number.trim() || null,
          weight_lbs: parseFloat(formData.weight_lbs),
          remote_id_serial: formData.remote_id_serial.trim() || null,
          remote_id_type: formData.remote_id_type,
          status: 'active'
        })

      if (insertError) throw insertError

      // Redirect to next step
      router.push('/onboarding/flights')
    } catch (err) {
      console.error('Error saving aircraft:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/profile')
  }

  const weightLbs = parseFloat(formData.weight_lbs) || 0
  const remoteIdRequired = weightLbs > 0.55

  return (
    <div>
      <OnboardingProgress />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Register Your First Aircraft
        </h2>
        <p className="text-slate-600">
          Add your drone to start tracking flights and compliance requirements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="registration_number">Registration Number *</Label>
            <Input
              id="registration_number"
              name="registration_number"
              type="text"
              value={formData.registration_number}
              onChange={handleInputChange}
              placeholder="e.g., FA3ABC123"
              required
            />
            <p className="text-sm text-slate-500 mt-1">
              FAA registration number for your aircraft
            </p>
          </div>

          <div>
            <Label htmlFor="registration_expiry">Registration Expiry</Label>
            <Input
              id="registration_expiry"
              name="registration_expiry"
              type="date"
              value={formData.registration_expiry}
              onChange={handleInputChange}
            />
            <p className="text-sm text-slate-500 mt-1">
              When your FAA registration expires
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manufacturer">Manufacturer *</Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              type="text"
              value={formData.manufacturer}
              onChange={handleInputChange}
              placeholder="e.g., DJI, Autel, Skydio"
              required
            />
          </div>

          <div>
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="e.g., Mavic 3, Air 2S"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight_lbs">Weight (lbs) *</Label>
            <Input
              id="weight_lbs"
              name="weight_lbs"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight_lbs}
              onChange={handleInputChange}
              placeholder="e.g., 1.4"
              required
            />
            <p className="text-sm text-slate-500 mt-1">
              Total weight including battery
            </p>
          </div>

          <div>
            <Label htmlFor="serial_number">Serial Number</Label>
            <Input
              id="serial_number"
              name="serial_number"
              type="text"
              value={formData.serial_number}
              onChange={handleInputChange}
              placeholder="Aircraft serial number"
            />
          </div>
        </div>

        {/* Remote ID Section */}
        {remoteIdRequired && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-2">
                  Remote ID Required
                </h4>
                <p className="text-sm text-amber-700 mb-4">
                  Your aircraft weighs over 0.55 lbs (250g) and requires Remote ID compliance.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="remote_id_serial">Remote ID Serial Number *</Label>
                    <Input
                      id="remote_id_serial"
                      name="remote_id_serial"
                      type="text"
                      value={formData.remote_id_serial}
                      onChange={handleInputChange}
                      placeholder="Remote ID module serial number"
                      required
                    />
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
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                Next: First Flight
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}