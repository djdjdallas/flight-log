'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import OnboardingProgress from '@/components/onboarding/OnboardingProgress'
import { ArrowRight, AlertCircle } from 'lucide-react'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: '',
    pilot_certificate_number: '',
    pilot_certificate_expiry: '',
    phone: ''
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
        setFormData(prev => ({ ...prev, email: user.email }))
        
        // Check if profile already exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            pilot_certificate_number: profile.pilot_certificate_number || '',
            pilot_certificate_expiry: profile.pilot_certificate_expiry || '',
            phone: profile.phone || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
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
      if (!user) throw new Error('User not found')

      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required')
      }

      if (!formData.pilot_certificate_number.trim()) {
        throw new Error('Part 107 certificate number is required')
      }

      if (!formData.pilot_certificate_expiry) {
        throw new Error('Part 107 certificate expiry date is required')
      }

      // Validate expiry date is in the future
      const expiryDate = new Date(formData.pilot_certificate_expiry)
      const today = new Date()
      if (expiryDate <= today) {
        throw new Error('Part 107 certificate expiry date must be in the future')
      }

      // Upsert user profile
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name.trim(),
          pilot_certificate_number: formData.pilot_certificate_number.trim(),
          pilot_certificate_expiry: formData.pilot_certificate_expiry,
          phone: formData.phone.trim() || null
        })

      if (upsertError) throw upsertError

      // Create default user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notification_email: true,
          notification_push: true,
          compliance_alerts: true,
          expiry_reminders: true,
          weekly_summary: true
        })

      if (settingsError) {
        console.warn('Error creating user settings:', settingsError)
        // Don't fail the whole process for this
      }

      // Redirect to next step
      router.push('/onboarding/aircraft')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <OnboardingProgress />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-slate-600">
          We need some basic information to set up your account for compliant drone operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="pilot_certificate_number">Part 107 Certificate Number *</Label>
          <Input
            id="pilot_certificate_number"
            name="pilot_certificate_number"
            type="text"
            value={formData.pilot_certificate_number}
            onChange={handleChange}
            placeholder="e.g., 4123456"
            required
          />
          <p className="text-sm text-slate-500 mt-1">
            Your Remote Pilot Certificate number from the FAA
          </p>
        </div>

        <div>
          <Label htmlFor="pilot_certificate_expiry">Certificate Expiry Date *</Label>
          <Input
            id="pilot_certificate_expiry"
            name="pilot_certificate_expiry"
            type="date"
            value={formData.pilot_certificate_expiry}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-slate-500 mt-1">
            Part 107 certificates are valid for 24 months
          </p>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
          <p className="text-sm text-slate-500 mt-1">
            Optional: For important compliance notifications
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <div></div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                Next: Add Aircraft
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}