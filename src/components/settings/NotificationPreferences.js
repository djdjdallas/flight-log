'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Mail, 
  Calendar,
  Shield,
  FileText,
  Clock,
  Save
} from 'lucide-react'

export default function NotificationPreferences() {
  const [settings, setSettings] = useState({
    notification_email: true,
    notification_push: true,
    compliance_alerts: true,
    expiry_reminders: true,
    weekly_summary: true,
    reminder_days_registration: 30,
    reminder_days_part107: 60
  })
  const [originalSettings, setOriginalSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    // Check if there are unsaved changes
    const hasChanges = Object.keys(settings).some(key => 
      settings[key] !== originalSettings[key]
    )
    setHasChanges(hasChanges)
  }, [settings, originalSettings])

  async function fetchSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userSettings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      const settingsData = {
        notification_email: userSettings?.notification_email ?? true,
        notification_push: userSettings?.notification_push ?? true,
        compliance_alerts: userSettings?.compliance_alerts ?? true,
        expiry_reminders: userSettings?.expiry_reminders ?? true,
        weekly_summary: userSettings?.weekly_summary ?? true,
        reminder_days_registration: userSettings?.reminder_days_registration ?? 30,
        reminder_days_part107: userSettings?.reminder_days_part107 ?? 60
      }

      setSettings(settingsData)
      setOriginalSettings(settingsData)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load notification preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
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

      // Upsert settings
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        })

      if (error) throw error

      setOriginalSettings(settings)
      setSuccess('Notification preferences updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setSettings(originalSettings)
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse flex items-center justify-between py-4">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="h-3 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="h-6 w-11 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  const notificationSections = [
    {
      title: 'Delivery Methods',
      icon: Bell,
      items: [
        {
          key: 'notification_email',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: Mail
        },
        {
          key: 'notification_push',
          label: 'In-App Notifications',
          description: 'Show notifications in the dashboard',
          icon: Bell
        }
      ]
    },
    {
      title: 'Compliance & Safety',
      icon: Shield,
      items: [
        {
          key: 'compliance_alerts',
          label: 'Compliance Violations',
          description: 'Alert me when compliance issues are detected',
          icon: AlertTriangle
        },
        {
          key: 'expiry_reminders',
          label: 'Document Expiry Reminders',
          description: 'Remind me when certificates and registrations expire',
          icon: Calendar
        }
      ]
    },
    {
      title: 'Reports & Updates',
      icon: FileText,
      items: [
        {
          key: 'weekly_summary',
          label: 'Weekly Summary',
          description: 'Send a weekly report of flight activity and compliance',
          icon: FileText
        }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {notificationSections.map((section, sectionIndex) => (
        <div key={section.title} className="space-y-4">
          <div className="flex items-center space-x-2">
            <section.icon className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-medium">{section.title}</h3>
          </div>

          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3">
                <div className="flex items-start space-x-3">
                  <item.icon className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={item.key}
                  checked={settings[item.key]}
                  onCheckedChange={(value) => handleToggle(item.key, value)}
                />
              </div>
            ))}
          </div>

          {sectionIndex < notificationSections.length - 1 && <Separator />}
        </div>
      ))}

      {/* Reminder Timing */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Reminder Timing</h3>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Registration Expiry</Label>
              <p className="text-sm text-slate-600">
                Send reminders {settings.reminder_days_registration} days before expiry
              </p>
            </div>
            <div className="text-sm text-slate-500">
              {settings.reminder_days_registration} days
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Part 107 Certificate</Label>
              <p className="text-sm text-slate-600">
                Send reminders {settings.reminder_days_part107} days before expiry
              </p>
            </div>
            <div className="text-sm text-slate-500">
              {settings.reminder_days_part107} days
            </div>
          </div>
        </div>
      </div>

      {/* Example Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Example Notifications</h3>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Compliance violation detected in recent flight
              </span>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Part 107 certificate expires in 30 days
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Weekly flight summary: 5 flights, 100% compliance
              </span>
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
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  )
}