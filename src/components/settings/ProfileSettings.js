'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Phone, 
  Mail,
  User,
  Save
} from 'lucide-react'
import { complianceChecker } from '@/lib/compliance/checker'

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    pilot_certificate_number: '',
    pilot_certificate_expiry: ''
  })
  const [originalProfile, setOriginalProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    // Check if there are unsaved changes
    const hasChanges = Object.keys(profile).some(key => 
      profile[key] !== originalProfile[key]
    )
    setHasChanges(hasChanges)
  }, [profile, originalProfile])

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      const profileData = {
        full_name: userProfile?.full_name || '',
        email: user.email || '',
        phone: userProfile?.phone || '',
        pilot_certificate_number: userProfile?.pilot_certificate_number || '',
        pilot_certificate_expiry: userProfile?.pilot_certificate_expiry || ''
      }

      setProfile(profileData)
      setOriginalProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate required fields
      if (!profile.full_name.trim()) {
        throw new Error('Full name is required')
      }

      if (profile.pilot_certificate_number && !profile.pilot_certificate_expiry) {
        throw new Error('Certificate expiry date is required when certificate number is provided')
      }

      if (profile.pilot_certificate_expiry && !profile.pilot_certificate_number) {
        throw new Error('Certificate number is required when expiry date is provided')
      }

      // Validate expiry date is in the future
      if (profile.pilot_certificate_expiry) {
        const expiryDate = new Date(profile.pilot_certificate_expiry)
        const today = new Date()
        if (expiryDate <= today) {
          throw new Error('Certificate expiry date must be in the future')
        }
      }

      // Update profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profile.full_name.trim(),
          phone: profile.phone.trim() || null,
          pilot_certificate_number: profile.pilot_certificate_number.trim() || null,
          pilot_certificate_expiry: profile.pilot_certificate_expiry || null
        })

      if (error) throw error

      setOriginalProfile(profile)
      setSuccess('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(originalProfile)
    setError('')
    setSuccess('')
  }

  const getPart107Status = () => {
    if (!profile.pilot_certificate_expiry) return null
    return complianceChecker.checkPart107Expiry({ pilot_certificate_expiry: profile.pilot_certificate_expiry })
  }

  const part107Status = getPart107Status()

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500 mt-1">
              Email cannot be changed from this page
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
            <p className="text-xs text-slate-500 mt-1">
              For compliance notifications and support
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Pilot Certification */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Pilot Certification</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pilot_certificate_number">Part 107 Certificate Number</Label>
            <Input
              id="pilot_certificate_number"
              value={profile.pilot_certificate_number}
              onChange={(e) => handleChange('pilot_certificate_number', e.target.value)}
              placeholder="e.g., 4123456"
            />
          </div>

          <div>
            <Label htmlFor="pilot_certificate_expiry">Certificate Expiry Date</Label>
            <Input
              id="pilot_certificate_expiry"
              type="date"
              value={profile.pilot_certificate_expiry}
              onChange={(e) => handleChange('pilot_certificate_expiry', e.target.value)}
            />
          </div>
        </div>

        {/* Part 107 Status */}
        {part107Status && (
          <div className={`p-4 rounded-lg border ${
            part107Status.severity === 'error' ? 'bg-red-50 border-red-200' :
            part107Status.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              {part107Status.severity === 'error' ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : part107Status.severity === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <div>
                <p className={`font-medium ${
                  part107Status.severity === 'error' ? 'text-red-800' :
                  part107Status.severity === 'warning' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {part107Status.message}
                </p>
                {part107Status.daysRemaining && (
                  <p className="text-xs text-slate-600 mt-1">
                    {part107Status.daysRemaining > 0 ? 
                      `${part107Status.daysRemaining} days remaining` : 
                      `Expired ${Math.abs(part107Status.daysRemaining)} days ago`
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={!hasChanges || saving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}