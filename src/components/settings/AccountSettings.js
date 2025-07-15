'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  Key, 
  Mail, 
  Shield,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

export default function AccountSettings() {
  const [user, setUser] = useState(null)
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(true)
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setEmailForm(prev => ({ ...prev, newEmail: user.email }))
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Failed to load account data')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (field, value) => {
    setEmailForm(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    setEmailLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate email format
      if (!emailForm.newEmail.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      if (emailForm.newEmail === user.email) {
        throw new Error('New email must be different from current email')
      }

      if (!emailForm.password) {
        throw new Error('Current password is required to change email')
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail,
        password: emailForm.password
      })

      if (error) throw error

      setSuccess('Email update initiated. Please check your new email for confirmation.')
      setEmailForm(prev => ({ ...prev, password: '' }))
    } catch (error) {
      console.error('Error updating email:', error)
      setError(error.message)
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate password requirements
      if (passwordForm.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long')
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (!passwordForm.currentPassword) {
        throw new Error('Current password is required')
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error updating password:', error)
      setError(error.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Email Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Email Address</h3>
        </div>

        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div>
            <Label htmlFor="current-email">Current Email</Label>
            <Input
              id="current-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-slate-50"
            />
          </div>

          <div>
            <Label htmlFor="new-email">New Email Address</Label>
            <Input
              id="new-email"
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => handleEmailChange('newEmail', e.target.value)}
              placeholder="Enter new email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="email-password">Current Password</Label>
            <div className="relative">
              <Input
                id="email-password"
                type={showPasswords.current ? 'text' : 'password'}
                value={emailForm.password}
                onChange={(e) => handleEmailChange('password', e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Required to confirm email change
            </p>
          </div>

          <Button
            type="submit"
            disabled={emailLoading || emailForm.newEmail === user?.email}
          >
            {emailLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Email
              </>
            )}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Password Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Password</h3>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={passwordLoading}
          >
            {passwordLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Security Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Security Information</h3>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Account Security</h4>
              <ul className="text-sm text-blue-800 mt-1 space-y-1">
                <li>• Your account is protected by Supabase authentication</li>
                <li>• All data is encrypted in transit and at rest</li>
                <li>• Password resets are sent to your registered email</li>
                <li>• Login attempts are monitored for suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>
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
    </div>
  )
}