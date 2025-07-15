'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { FileText, Download, Calendar, Filter } from 'lucide-react'
import { generateComplianceReport } from '@/lib/reports/pdf-generator'

export default function ReportGenerator() {
  const [formData, setFormData] = useState({
    reportType: 'audit',
    dateFrom: '',
    dateTo: '',
    aircraftId: '',
    includeNonCompliant: true,
    includeFlightPaths: false,
    includeBatteryData: true
  })
  
  const [aircraft, setAircraft] = useState([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchAircraft()
    
    // Set default date range to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    setFormData(prev => ({
      ...prev,
      dateTo: today.toISOString().split('T')[0],
      dateFrom: thirtyDaysAgo.toISOString().split('T')[0]
    }))
  }, [])

  async function fetchAircraft() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('aircraft')
        .select('id, registration_number, manufacturer, model')
        .eq('user_id', user.id)
        .order('manufacturer')

      setAircraft(data || [])
    } catch (error) {
      console.error('Error fetching aircraft:', error)
    }
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate date range
      if (!formData.dateFrom || !formData.dateTo) {
        throw new Error('Please select a date range')
      }

      if (new Date(formData.dateFrom) > new Date(formData.dateTo)) {
        throw new Error('Start date must be before end date')
      }

      // Fetch flights for the report
      let query = supabase
        .from('flights')
        .select(`
          id,
          flight_number,
          start_time,
          end_time,
          duration_minutes,
          compliance_status,
          takeoff_location,
          landing_location,
          max_altitude_ft,
          max_speed_mph,
          purpose,
          remote_id_verified,
          airspace_authorization_id,
          aircraft:aircraft_id (
            id,
            registration_number,
            manufacturer,
            model,
            remote_id_serial
          ),
          batteries:battery_id (
            serial_number,
            cycle_count
          )
        `)
        .eq('pilot_id', user.id)
        .gte('start_time', formData.dateFrom)
        .lte('start_time', formData.dateTo + 'T23:59:59')
        .order('start_time', { ascending: false })

      if (formData.aircraftId) {
        query = query.eq('aircraft_id', formData.aircraftId)
      }

      const { data: flights, error: flightsError } = await query

      if (flightsError) throw flightsError

      if (!flights || flights.length === 0) {
        throw new Error('No flights found for the selected criteria')
      }

      // Get user profile for report header
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, pilot_certificate_number, organization_id')
        .eq('id', user.id)
        .single()

      // Generate the PDF report
      const reportData = {
        reportType: formData.reportType,
        dateRange: {
          from: formData.dateFrom,
          to: formData.dateTo
        },
        pilot: {
          name: profile?.full_name || user.email,
          certificate: profile?.pilot_certificate_number,
          email: user.email
        },
        flights,
        options: {
          includeNonCompliant: formData.includeNonCompliant,
          includeFlightPaths: formData.includeFlightPaths,
          includeBatteryData: formData.includeBatteryData
        }
      }

      const pdfBlob = await generateComplianceReport(reportData)

      // Save report record to database
      const { data: reportRecord, error: reportError } = await supabase
        .from('compliance_reports')
        .insert({
          user_id: user.id,
          report_type: formData.reportType,
          date_range_start: formData.dateFrom,
          date_range_end: formData.dateTo,
          flight_ids: flights.map(f => f.id),
          generated_at: new Date().toISOString(),
          status: 'generated'
        })
        .select()
        .single()

      if (reportError) {
        console.warn('Failed to save report record:', reportError)
        // Don't throw - we still have the PDF
      }

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `flight-compliance-report-${formData.dateFrom}-to-${formData.dateTo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess(`Report generated successfully! ${flights.length} flights included.`)

    } catch (err) {
      console.error('Error generating report:', err)
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const reportTypes = [
    { value: 'audit', label: 'Regulatory Audit Report', description: 'Comprehensive compliance report for FAA audits' },
    { value: 'part107', label: 'Part 107 Operations Report', description: 'Commercial operations summary and compliance' },
    { value: 'remote_id', label: 'Remote ID Compliance Report', description: 'Remote ID verification and compliance status' },
    { value: 'maintenance', label: 'Maintenance Log Report', description: 'Aircraft and battery maintenance tracking' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Generate Compliance Report
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Report Type */}
          <div>
            <Label htmlFor="reportType">Report Type</Label>
            <Select 
              value={formData.reportType} 
              onValueChange={(value) => handleChange('reportType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">Start Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={formData.dateFrom}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateTo">End Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={formData.dateTo}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Aircraft Filter */}
          <div>
            <Label htmlFor="aircraftId">Aircraft (Optional)</Label>
            <Select 
              value={formData.aircraftId} 
              onValueChange={(value) => handleChange('aircraftId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All aircraft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All aircraft</SelectItem>
                {aircraft.map((aircraft) => (
                  <SelectItem key={aircraft.id} value={aircraft.id}>
                    {aircraft.manufacturer} {aircraft.model} ({aircraft.registration_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Options */}
          <div>
            <Label>Report Options</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeNonCompliant"
                  checked={formData.includeNonCompliant}
                  onChange={(e) => handleChange('includeNonCompliant', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="includeNonCompliant" className="text-sm">
                  Include non-compliant flights
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeFlightPaths"
                  checked={formData.includeFlightPaths}
                  onChange={(e) => handleChange('includeFlightPaths', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="includeFlightPaths" className="text-sm">
                  Include flight path maps (increases file size)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeBatteryData"
                  checked={formData.includeBatteryData}
                  onChange={(e) => handleChange('includeBatteryData', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="includeBatteryData" className="text-sm">
                  Include battery cycle data
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={generating} className="w-full">
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate & Download Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}