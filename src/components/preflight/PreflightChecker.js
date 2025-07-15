'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { complianceChecker } from '@/lib/compliance/checker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Plane, 
  Shield,
  Clock,
  FileText,
  RefreshCw,
  Check,
  X
} from 'lucide-react'

export default function PreflightChecker() {
  const [aircraft, setAircraft] = useState([])
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [user, setUser] = useState(null)
  const [complianceResult, setComplianceResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [lastCheck, setLastCheck] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      // Get user aircraft
      const { data: userAircraft } = await supabase
        .from('aircraft')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      setUser(profile)
      setAircraft(userAircraft || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function performPreflightCheck() {
    if (!selectedAircraft || !user) return

    setChecking(true)
    setError('')

    try {
      const aircraftData = aircraft.find(a => a.id === selectedAircraft)
      if (!aircraftData) throw new Error('Aircraft not found')

      // Create a mock flight object for compliance checking
      const mockFlight = {
        aircraft_id: selectedAircraft,
        pilot_id: user.id,
        max_altitude_ft: 400, // Default to 400ft
        remote_id_verified: true, // Assume verified for preflight
        airspace_authorization_id: null
      }

      const result = await complianceChecker.validateFlightCompliance(mockFlight, aircraftData, user)
      setComplianceResult(result)
      setLastCheck(new Date())
    } catch (error) {
      console.error('Error performing preflight check:', error)
      setError('Failed to perform preflight check: ' + error.message)
    } finally {
      setChecking(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600'
      case 'warning': return 'text-orange-600'
      case 'info': return 'text-blue-600'
      case 'success': return 'text-green-600'
      default: return 'text-slate-600'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'info': return <Info className="h-4 w-4 text-blue-600" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 border-green-300">SAFE TO FLY</Badge>
      case 'non_compliant':
        return <Badge className="bg-red-100 text-red-800 border-red-300">FIX ISSUES FIRST</Badge>
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">PROCEED WITH CAUTION</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300">UNKNOWN</Badge>
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    )
  }

  if (aircraft.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>No Aircraft Available</span>
          </CardTitle>
          <CardDescription>
            You need to add at least one aircraft to perform a pre-flight check
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/dashboard/aircraft'}>
            Add Aircraft
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Aircraft Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>Select Aircraft</span>
          </CardTitle>
          <CardDescription>
            Choose the aircraft you plan to fly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
              <SelectTrigger>
                <SelectValue placeholder="Select an aircraft" />
              </SelectTrigger>
              <SelectContent>
                {aircraft.map((craft) => (
                  <SelectItem key={craft.id} value={craft.id}>
                    {craft.manufacturer} {craft.model} ({craft.registration_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedAircraft && (
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={performPreflightCheck}
                  disabled={checking}
                  className="flex items-center space-x-2"
                >
                  {checking ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Run Pre-flight Check</span>
                    </>
                  )}
                </Button>

                {lastCheck && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Last checked: {lastCheck.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Results */}
      {complianceResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Pre-flight Compliance Check</span>
              </span>
              {getStatusBadge(complianceResult.status)}
            </CardTitle>
            <CardDescription>
              Compliance status for your selected aircraft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="text-center p-6 rounded-lg border-2 border-dashed" 
                   style={{
                     borderColor: complianceResult.status === 'compliant' ? '#10b981' : 
                                complianceResult.status === 'non_compliant' ? '#ef4444' : '#f59e0b',
                     backgroundColor: complianceResult.status === 'compliant' ? '#f0fdf4' : 
                                    complianceResult.status === 'non_compliant' ? '#fef2f2' : '#fffbeb'
                   }}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {complianceResult.status === 'compliant' ? (
                    <Check className="h-8 w-8 text-green-600" />
                  ) : (
                    <X className="h-8 w-8 text-red-600" />
                  )}
                  <span className="text-2xl font-bold">
                    {complianceResult.status === 'compliant' ? 'SAFE TO FLY' : 
                     complianceResult.status === 'non_compliant' ? 'FIX ISSUES FIRST' : 
                     'PROCEED WITH CAUTION'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {complianceResult.status === 'compliant' ? 
                    'All compliance requirements are met for this flight' :
                    complianceResult.status === 'non_compliant' ?
                    'Critical compliance issues must be resolved before flying' :
                    'Some warnings present - review before proceeding'}
                </p>
              </div>

              <Separator />

              {/* Detailed Checks */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 mb-3">Detailed Compliance Checks</h4>
                
                {complianceResult.checks.map((check, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    {getSeverityIcon(check.status?.severity || 'info')}
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {check.type === 'remote_id' ? 'Remote ID' : 
                         check.type === 'registration' ? 'Aircraft Registration' :
                         check.type === 'part107' ? 'Part 107 Certificate' : check.type}
                      </div>
                      <div className={`text-sm ${getSeverityColor(check.status?.severity || 'info')}`}>
                        {check.status?.message || 'Status unknown'}
                      </div>
                      
                      {check.type === 'remote_id' && (
                        <div className="text-xs text-slate-600 mt-1">
                          Required: {check.required ? 'Yes' : 'No'} | 
                          Verified: {check.verified ? 'Yes' : 'No'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Violations */}
              {complianceResult.violations.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-900 mb-3">Critical Issues</h4>
                    {complianceResult.violations.map((violation, index) => (
                      <Alert key={index} variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{violation.message}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </>
              )}

              {/* Warnings */}
              {complianceResult.warnings.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-900 mb-3">Warnings</h4>
                    {complianceResult.warnings.map((warning, index) => (
                      <Alert key={index} className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          {warning.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={performPreflightCheck}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-check</span>
                </Button>
                
                {complianceResult.status === 'compliant' && (
                  <Button 
                    onClick={() => window.location.href = '/dashboard/flights/new'}
                    className="flex items-center space-x-2"
                  >
                    <Plane className="h-4 w-4" />
                    <span>Log Flight</span>
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/compliance'}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Full Compliance</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}