'use client'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Plane,
  Clock,
  Mountain,
  Gauge
} from 'lucide-react'

const SUPPORTED_FORMATS = {
  dji: {
    name: 'DJI',
    description: 'Export from Airdata.com or PhantomHelp',
    extensions: ['.csv'],
    helpUrl: 'https://app.airdata.com',
    models: ['Mavic', 'Mini', 'Air', 'Phantom', 'Inspire', 'Matrice']
  },
  autel: {
    name: 'Autel',
    description: 'Export from Autel Sky app',
    extensions: ['.json', '.csv'],
    models: ['EVO Lite', 'EVO II', 'EVO Nano', 'EVO Max']
  },
  skydio: {
    name: 'Skydio',
    description: 'Export from Skydio app or cloud',
    extensions: ['.csv', '.json'],
    models: ['Skydio 2', 'Skydio 2+', 'Skydio X2']
  },
  generic: {
    name: 'Generic GPS',
    description: 'Any CSV/JSON with lat/lng data',
    extensions: ['.csv', '.json']
  }
}

export default function LogUpload({ aircraftId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [selectedAircraftId, setSelectedAircraftId] = useState(aircraftId || '')
  const [aircraft, setAircraft] = useState([])
  const [uploadResult, setUploadResult] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    fetchAircraft()
  }, [])

  async function fetchAircraft() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('aircraft')
        .select('id, registration_number, manufacturer, model')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('manufacturer')

      setAircraft(data || [])
    } catch (error) {
      console.error('Error fetching aircraft:', error)
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!selectedAircraftId) {
      setError('Please select an aircraft before uploading flight logs')
      return
    }

    setUploading(true)
    setError('')
    setProgress(0)
    setUploadResult(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      for (const file of acceptedFiles) {
        setStatus(`Uploading ${file.name}...`)
        setProgress(10)

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size exceeds 10MB limit')
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('flight-logs')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError
        setProgress(30)

        // Read file content for format detection
        const fileContent = await file.text()
        setProgress(40)

        // Detect source and validate format
        const { source, isValid, message } = detectAndValidateFormat(file.name, fileContent)

        if (!isValid) {
          throw new Error(message)
        }

        // Verify aircraft ownership before creating flight
        setStatus('Verifying aircraft access...')
        const { data: aircraftCheck, error: aircraftError } = await supabase
          .from('aircraft')
          .select('id, user_id, manufacturer, model')
          .eq('id', selectedAircraftId)
          .eq('user_id', user.id)
          .single()

        if (aircraftError || !aircraftCheck) {
          throw new Error('Selected aircraft not found or access denied')
        }

        // Create flight record
        setStatus('Creating flight record...')
        setProgress(50)

        const flightData = {
          aircraft_id: selectedAircraftId,
          pilot_id: user.id,
          flight_number: `IMPORT_${Date.now()}`,
          start_time: new Date().toISOString(),
          compliance_status: 'processing'
        }

        const { data: flight, error: flightError } = await supabase
          .from('flights')
          .insert(flightData)
          .select()
          .single()

        if (flightError) {
          throw new Error(`Failed to create flight record: ${flightError.message}`)
        }
        setProgress(60)

        // Store flight log metadata
        setStatus('Storing flight log...')
        const { error: logError } = await supabase
          .from('flight_logs')
          .insert({
            flight_id: flight.id,
            import_source: source,
            raw_data: {
              storage_path: uploadData.path
            },
            file_name: file.name,
            file_size: file.size,
            import_status: 'uploaded'
          })

        if (logError) {
          throw new Error(`Failed to create flight log record: ${logError.message}`)
        }
        setProgress(75)

        // Call edge function to parse the log
        setStatus('Parsing flight data...')
        const { data: parseResult, error: parseError } = await supabase.functions.invoke('parse-flight-log', {
          body: {
            storagePath: uploadData.path,
            source,
            flightId: flight.id
          }
        })

        setProgress(100)

        if (parseError) {
          // Check if it's a function not found error
          if (parseError.message?.includes('Function not found')) {
            setStatus('Upload complete - parsing will be processed shortly')
            setUploadResult({
              success: true,
              pending: true,
              flightId: flight.id,
              fileName: file.name
            })
          } else {
            throw new Error(`Parsing failed: ${parseError.message}`)
          }
        } else if (parseResult?.success) {
          setStatus('Successfully imported flight log!')
          setUploadResult({
            success: true,
            flightId: flight.id,
            fileName: file.name,
            ...parseResult.data
          })
        } else {
          throw new Error(parseResult?.error || 'Unknown parsing error')
        }

        onUploadComplete?.(flight.id)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message)
      setStatus('')
      setUploadResult(null)
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProgress(0)
        if (!error) setStatus('')
      }, 5000)
    }
  }, [selectedAircraftId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false, // One file at a time for now
    disabled: uploading || !selectedAircraftId
  })

  function detectAndValidateFormat(fileName, content) {
    const trimmed = content.trim()

    // Check for binary content (native DJI files)
    let nonPrintable = 0
    const sample = trimmed.slice(0, 500)
    for (const char of sample) {
      const code = char.charCodeAt(0)
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        nonPrintable++
      }
    }
    if (nonPrintable / sample.length > 0.1) {
      return {
        source: 'unknown',
        isValid: false,
        message: 'This appears to be a native DJI binary log file (.txt). Please convert it to CSV using Airdata.com first, then upload the CSV file.'
      }
    }

    // Check for JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed)
        const lower = trimmed.toLowerCase()
        if (lower.includes('skydio') || lower.includes('autonomy_mode') || lower.includes('vehicle_latitude')) {
          return { source: 'skydio', isValid: true }
        }
        if (lower.includes('autel') || lower.includes('dronelatitude') || lower.includes('remainpower')) {
          return { source: 'autel', isValid: true }
        }
        if (lower.includes('dji') || lower.includes('mavic') || lower.includes('phantom')) {
          return { source: 'dji', isValid: true }
        }
        return { source: 'unknown', isValid: true }
      } catch {
        return {
          source: 'unknown',
          isValid: false,
          message: 'Invalid JSON format'
        }
      }
    }

    // Check for CSV
    if (trimmed.includes(',')) {
      const firstLine = trimmed.split('\n')[0].toLowerCase()

      // Check for Airdata format (most common DJI export)
      if (firstLine.includes('datetime(utc)') || firstLine.includes('height_above_takeoff')) {
        return { source: 'dji', isValid: true }
      }

      // Check for DJI native CSV format
      if (firstLine.includes('osd.') || firstLine.includes('gps_') || firstLine.includes('flycstate')) {
        return { source: 'dji', isValid: true }
      }

      // Check for Skydio CSV format
      if (firstLine.includes('autonomy_mode') || firstLine.includes('vehicle_latitude') || firstLine.includes('tracking_mode')) {
        return { source: 'skydio', isValid: true }
      }

      // Check for Autel CSV format
      if (firstLine.includes('dronelatitude') || firstLine.includes('remainpower') || firstLine.includes('homedistance')) {
        return { source: 'autel', isValid: true }
      }

      // Check for basic GPS columns
      if (firstLine.includes('lat') && (firstLine.includes('lon') || firstLine.includes('lng'))) {
        return { source: 'unknown', isValid: true }
      }

      // Check filename and content for brand names
      const lowerContent = content.toLowerCase()
      const lowerFileName = fileName.toLowerCase()

      if (lowerContent.includes('skydio') || lowerFileName.includes('skydio')) {
        return { source: 'skydio', isValid: true }
      }

      if (lowerContent.includes('dji') || lowerFileName.includes('dji')) {
        return { source: 'dji', isValid: true }
      }

      if (lowerContent.includes('autel') || lowerFileName.includes('autel')) {
        return { source: 'autel', isValid: true }
      }

      return {
        source: 'unknown',
        isValid: false,
        message: 'Could not find GPS data columns (latitude/longitude) in the CSV file. Please ensure you\'re uploading a flight log exported from Airdata.com or your drone\'s companion app.'
      }
    }

    return {
      source: 'unknown',
      isValid: false,
      message: 'Unsupported file format. Please upload a CSV file exported from Airdata.com or your drone\'s companion app.'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Flight Logs
        </CardTitle>
        <CardDescription>
          Upload flight logs from DJI, Autel, Skydio, or other drone manufacturers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aircraft Selection */}
        <div>
          <Label htmlFor="aircraft">Aircraft *</Label>
          <Select
            value={selectedAircraftId}
            onValueChange={setSelectedAircraftId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aircraft" />
            </SelectTrigger>
            <SelectContent>
              {aircraft.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.manufacturer} {a.model} ({a.registration_number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Select the aircraft that generated this flight log
          </p>
        </div>

        {/* Format Help */}
        <div className="bg-muted/50 rounded-lg p-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4" />
              Supported Formats
            </div>
            <span className="text-xs text-muted-foreground">
              {showHelp ? 'Hide' : 'Show'}
            </span>
          </button>

          {showHelp && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="p-3 bg-background rounded border">
                <div className="font-medium flex items-center gap-2">
                  DJI Drones
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Recommended</span>
                </div>
                <p className="text-muted-foreground mt-1">
                  Native .txt files must be converted first. Use{' '}
                  <a
                    href="https://app.airdata.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Airdata.com <ExternalLink className="h-3 w-3" />
                  </a>
                  {' '}to sync your flights and export as CSV.
                </p>
              </div>

              <div className="p-3 bg-background rounded border">
                <div className="font-medium">Autel Drones</div>
                <p className="text-muted-foreground mt-1">
                  Export flight logs as JSON or CSV from the Autel Sky app.
                  <span className="block text-xs mt-1">Supports: EVO Lite, EVO II, EVO Nano, EVO Max</span>
                </p>
              </div>

              <div className="p-3 bg-background rounded border">
                <div className="font-medium">Skydio Drones</div>
                <p className="text-muted-foreground mt-1">
                  Export flight data from the Skydio app or{' '}
                  <a
                    href="https://cloud.skydio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    cloud.skydio.com <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="block text-xs mt-1">Supports: Skydio 2, Skydio 2+, Skydio X2</span>
                </p>
              </div>

              <div className="p-3 bg-background rounded border">
                <div className="font-medium">Other Drones</div>
                <p className="text-muted-foreground mt-1">
                  Any CSV or JSON file with latitude and longitude data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
            }
            ${uploading || !selectedAircraftId ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {!selectedAircraftId
                    ? 'Select an aircraft above to upload'
                    : isDragActive
                    ? 'Drop files here'
                    : 'Drop flight log here, or click to browse'
                  }
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV from Airdata/Skydio, JSON from Autel, or any GPS file
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Result */}
        {uploadResult?.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">
              {uploadResult.pending ? 'Upload Complete' : 'Flight Log Imported'}
            </AlertTitle>
            <AlertDescription className="text-green-700">
              {uploadResult.pending ? (
                <span>
                  {uploadResult.fileName} uploaded successfully. Processing in background.
                </span>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {uploadResult.duration !== undefined && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{uploadResult.duration} min duration</span>
                    </div>
                  )}
                  {uploadResult.maxAltitude !== undefined && (
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4" />
                      <span>{uploadResult.maxAltitude} ft max altitude</span>
                    </div>
                  )}
                  {uploadResult.maxSpeed !== undefined && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>{uploadResult.maxSpeed} mph max speed</span>
                    </div>
                  )}
                  {uploadResult.pointCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span>{uploadResult.pointCount.toLocaleString()} GPS points</span>
                    </div>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
