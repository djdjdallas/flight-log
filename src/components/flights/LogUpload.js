'use client'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function LogUpload({ aircraftId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [selectedAircraftId, setSelectedAircraftId] = useState(aircraftId || '')
  const [aircraft, setAircraft] = useState([])

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
    // Validate aircraft selection before starting upload
    if (!selectedAircraftId) {
      setError('Please select an aircraft before uploading flight logs')
      return
    }

    setUploading(true)
    setError('')
    setProgress(0)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      for (const file of acceptedFiles) {
        setStatus(`Uploading ${file.name}...`)
        setProgress(10)

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

        // Read file content for processing
        const fileContent = await file.text()
        setProgress(50)

        // Determine source based on file format
        const source = detectLogSource(file.name, fileContent)
        
        // Verify aircraft ownership before creating flight
        setStatus(`Verifying aircraft access...`)
        const { data: aircraftCheck, error: aircraftError } = await supabase
          .from('aircraft')
          .select('id, user_id')
          .eq('id', selectedAircraftId)
          .eq('user_id', user.id)
          .single()

        if (aircraftError || !aircraftCheck) {
          console.error('Aircraft verification error:', aircraftError)
          throw new Error('Selected aircraft not found or access denied')
        }

        console.log('User ID:', user.id)
        console.log('Aircraft ID:', selectedAircraftId)
        console.log('Aircraft Owner:', aircraftCheck.user_id)

        // Create flight record first
        setStatus(`Creating flight record...`)
        const flightData = {
          aircraft_id: selectedAircraftId,
          pilot_id: user.id,
          flight_number: `IMPORT_${Date.now()}`,
          start_time: new Date().toISOString(),
          compliance_status: 'processing'
        }
        
        console.log('Inserting flight data:', flightData)
        
        const { data: flight, error: flightError } = await supabase
          .from('flights')
          .insert(flightData)
          .select()
          .single()

        if (flightError) {
          console.error('Flight insert error:', flightError)
          console.error('Error details:', JSON.stringify(flightError, null, 2))
          throw new Error(`Failed to create flight record: ${flightError.message}`)
        }
        setProgress(60)

        // Store flight log metadata with storage path
        const { error: logError } = await supabase
          .from('flight_logs')
          .insert({
            flight_id: flight.id,
            import_source: source,
            raw_data: { 
              storage_path: uploadData.path,
              file_url: `${supabase.storage.from('flight-logs').getPublicUrl(uploadData.path).data.publicUrl}`
            },
            file_name: file.name,
            file_size: file.size,
            import_status: 'uploaded'
          })

        if (logError) {
          console.error('Flight log insert error:', logError)
          throw new Error(`Failed to create flight log record: ${logError.message}`)
        }
        setProgress(75)

        // Call edge function to parse the log
        setStatus(`Parsing flight data...`)
        const { error: parseError } = await supabase.functions.invoke('parse-flight-log', {
          body: {
            storagePath: uploadData.path,
            source,
            flightId: flight.id
          }
        })

        if (parseError) {
          console.warn('Parse error:', parseError)
          // Don't throw here - we still have the file uploaded
          setStatus(`Upload complete - parsing failed: ${parseError.message}`)
        } else {
          setStatus(`Successfully imported ${file.name}`)
        }
        
        setProgress(100)
        onUploadComplete?.(flight.id)
      }
    } catch (err) {
      setError(err.message)
      setStatus('')
      
      // Cleanup on error - try to delete uploaded file if it exists
      // This is best effort, don't throw if cleanup fails
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProgress(0)
        setStatus('')
      }, 3000)
    }
  }, [selectedAircraftId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: true,
    disabled: uploading || !selectedAircraftId
  })

  function detectLogSource(fileName, content) {
    if (fileName.includes('DJI') || content.includes('DJI')) return 'dji'
    if (fileName.includes('Autel') || content.includes('Autel')) return 'autel'
    return 'unknown'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Flight Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Aircraft Selection */}
        <div className="mb-6">
          <Label htmlFor="aircraft">Aircraft *</Label>
          <Select 
            value={selectedAircraftId} 
            onValueChange={setSelectedAircraftId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aircraft" />
            </SelectTrigger>
            <SelectContent>
              {aircraft.map((aircraft) => (
                <SelectItem key={aircraft.id} value={aircraft.id}>
                  {aircraft.manufacturer} {aircraft.model} ({aircraft.registration_number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Select the aircraft that generated this flight log
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
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
                    ? 'Select an aircraft above to upload flight logs'
                    : isDragActive 
                    ? 'Drop files here' 
                    : 'Drop flight logs here, or click to browse'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports DJI (.txt, .csv) and Autel (.json) flight logs
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status && !uploading && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}