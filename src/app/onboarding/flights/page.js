'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import OnboardingProgress from '@/components/onboarding/OnboardingProgress'
import { ArrowLeft, Upload, PlusCircle, CheckCircle, FileText, Plane } from 'lucide-react'

export default function FlightsSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [aircraft, setAircraft] = useState(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Check if user has completed previous steps
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, pilot_certificate_number')
          .eq('id', user.id)
          .single()

        if (!profile?.full_name || !profile?.pilot_certificate_number) {
          router.push('/onboarding/profile')
          return
        }

        // Get user's aircraft
        const { data: userAircraft } = await supabase
          .from('aircraft')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (!userAircraft) {
          router.push('/onboarding/aircraft')
          return
        }

        setAircraft(userAircraft)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleUploadFlight = () => {
    // For now, just redirect to the upload page
    router.push('/dashboard/flights?action=upload')
  }

  const handleManualEntry = () => {
    // For now, just redirect to the manual entry page
    router.push('/dashboard/flights?action=manual')
  }

  const handleSkip = async () => {
    setLoading(true)
    setError('')

    try {
      if (!user) throw new Error('User not found')

      // Mark onboarding as completed
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error completing onboarding:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/aircraft')
  }

  return (
    <div>
      <OnboardingProgress />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Upload Your First Flight
        </h2>
        <p className="text-slate-600">
          Get started by uploading flight data or logging a flight manually. You can also skip this step and add flights later.
        </p>
      </div>

      {aircraft && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Plane className="h-5 w-5 text-slate-600" />
            <span className="font-medium text-slate-900">
              {aircraft.manufacturer} {aircraft.model}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Registration: {aircraft.registration_number} | Weight: {aircraft.weight_lbs} lbs
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleUploadFlight}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-sky-600" />
            </div>
            <CardTitle className="text-lg">Upload Flight Log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 text-center mb-4">
              Upload CSV or JSON flight data from your drone manufacturer's app (DJI, Autel, etc.)
            </p>
            <Button className="w-full" onClick={handleUploadFlight}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Flight Data
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleManualEntry}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-lg">Manual Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 text-center mb-4">
              Manually log flight details including location, duration, and purpose
            </p>
            <Button variant="outline" className="w-full" onClick={handleManualEntry}>
              <FileText className="h-4 w-4 mr-2" />
              Add Flight Manually
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 text-sm text-slate-600">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span>You can add flights anytime from your dashboard</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleSkip}
          disabled={loading}
          variant="default"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Completing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Setup
            </>
          )}
        </Button>
      </div>
    </div>
  )
}