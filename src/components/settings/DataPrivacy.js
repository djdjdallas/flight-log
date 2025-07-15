'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Trash2, 
  Shield,
  Database,
  FileText,
  HardDrive,
  Calendar
} from 'lucide-react'

export default function DataPrivacy() {
  const [user, setUser] = useState(null)
  const [dataStats, setDataStats] = useState({
    flights: 0,
    aircraft: 0,
    reports: 0,
    totalSize: 0,
    accountAge: 0
  })
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Get user profile to calculate account age
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', user.id)
        .single()

      // Get data counts
      const [flightsResponse, aircraftResponse, reportsResponse] = await Promise.all([
        supabase
          .from('flights')
          .select('id', { count: 'exact' })
          .eq('pilot_id', user.id),
        supabase
          .from('aircraft')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('compliance_reports')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
      ])

      const accountAge = profile?.created_at ? 
        Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)) : 0

      setDataStats({
        flights: flightsResponse.count || 0,
        aircraft: aircraftResponse.count || 0,
        reports: reportsResponse.count || 0,
        totalSize: Math.floor(Math.random() * 50) + 10, // Placeholder - would need actual calculation
        accountAge
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load data information')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setExportLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Fetch all user data
      const [profile, flights, aircraft, reports, settings] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', user.id).single(),
        supabase.from('flights').select('*').eq('pilot_id', user.id),
        supabase.from('aircraft').select('*').eq('user_id', user.id),
        supabase.from('compliance_reports').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single()
      ])

      const exportData = {
        export_info: {
          generated_at: new Date().toISOString(),
          user_id: user.id,
          email: user.email,
          format: 'JSON'
        },
        profile: profile.data,
        flights: flights.data || [],
        aircraft: aircraft.data || [],
        reports: reports.data || [],
        settings: settings.data || {}
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `flightlog-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess('Data export completed successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      setError('Failed to export data: ' + error.message)
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your flight data, aircraft, and reports will be permanently deleted.'
    )

    if (!confirmed) return

    // Double confirmation for account deletion
    const doubleConfirmed = window.confirm(
      'This is your final warning. Deleting your account will permanently remove all data and cannot be reversed. Type "DELETE" to confirm.'
    )

    if (!doubleConfirmed) return

    setDeleteLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Delete user data (RLS policies will handle access control)
      await Promise.all([
        supabase.from('compliance_reports').delete().eq('user_id', user.id),
        supabase.from('notifications').delete().eq('user_id', user.id),
        supabase.from('user_settings').delete().eq('user_id', user.id),
        supabase.from('flights').delete().eq('pilot_id', user.id),
        supabase.from('aircraft').delete().eq('user_id', user.id),
        supabase.from('user_profiles').delete().eq('id', user.id)
      ])

      // Delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      if (authError) throw authError

      setSuccess('Account deleted successfully. You will be redirected to the login page.')
      
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 2000)
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account: ' + error.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Data Summary */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Your Data Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{dataStats.flights}</div>
                <div className="text-sm text-blue-700">Flights</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-green-600 rounded"></div>
              <div>
                <div className="text-2xl font-bold text-green-900">{dataStats.aircraft}</div>
                <div className="text-sm text-green-700">Aircraft</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{dataStats.reports}</div>
                <div className="text-sm text-purple-700">Reports</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">{dataStats.accountAge}</div>
                <div className="text-sm text-orange-700">Days old</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Data Export */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Export Your Data</h3>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-start space-x-3">
            <HardDrive className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-900 mb-2">
                Download All Your Data
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Export all your flight logs, aircraft information, compliance reports, and settings 
                in JSON format. This includes all data associated with your account.
              </p>
              <div className="text-xs text-slate-500 mb-4">
                <strong>Includes:</strong> Profile, flights, aircraft, reports, settings, and notifications
              </div>
              <Button
                onClick={handleExportData}
                disabled={exportLoading}
              >
                {exportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Privacy Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium">Privacy & Security</h3>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                How We Protect Your Data
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• All data is encrypted in transit and at rest</li>
                <li>• We never share your personal flight data with third parties</li>
                <li>• Your data is stored securely in SOC 2 compliant infrastructure</li>
                <li>• Access to your data is restricted by row-level security policies</li>
                <li>• We retain data only as long as your account is active</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Deletion */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Delete Your Account
              </h4>
              <p className="text-sm text-red-800 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
                All your flights, aircraft, reports, and settings will be permanently removed.
              </p>
              <div className="text-xs text-red-700 mb-4">
                <strong>Warning:</strong> This will delete {dataStats.flights} flights, {dataStats.aircraft} aircraft, 
                and {dataStats.reports} reports. Consider exporting your data first.
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
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