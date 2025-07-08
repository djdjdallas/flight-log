'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function LogUpload({ aircraftId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    setError('')
    setProgress(0)

    try {
      for (const file of acceptedFiles) {
        setStatus(`Processing ${file.name}...`)
        setProgress(25)

        // Read file content
        const fileContent = await file.text()
        setProgress(50)

        // Determine source based on file format
        const source = detectLogSource(file.name, fileContent)
        
        // Create flight record first
        const { data: flight, error: flightError } = await supabase
          .from('flights')
          .insert({
            aircraft_id: aircraftId,
            pilot_id: (await supabase.auth.getUser()).data.user.id,
            flight_number: `IMPORT_${Date.now()}`,
            start_time: new Date().toISOString(),
            compliance_status: 'processing'
          })
          .select()
          .single()

        if (flightError) throw flightError
        setProgress(75)

        // Store raw log data
        const { error: logError } = await supabase
          .from('flight_logs')
          .insert({
            flight_id: flight.id,
            import_source: source,
            raw_data: { content: fileContent },
            file_name: file.name,
            file_size: file.size,
            import_status: 'uploaded'
          })

        if (logError) throw logError

        // Call edge function to parse the log
        const { error: parseError } = await supabase.functions.invoke('parse-flight-log', {
          body: {
            logData: fileContent,
            source,
            flightId: flight.id
          }
        })

        if (parseError) throw parseError
        setProgress(100)
        
        setStatus(`Successfully imported ${file.name}`)
        onUploadComplete?.(flight.id)
      }
    } catch (err) {
      setError(err.message)
      setStatus('')
    } finally {
      setUploading(false)
      setTimeout(() => {
        setProgress(0)
        setStatus('')
      }, 3000)
    }
  }, [aircraftId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: true,
    disabled: uploading
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
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
            }
            ${uploading ? 'cursor-not-allowed opacity-50' : ''}
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
                  {isDragActive ? 'Drop files here' : 'Drop flight logs here, or click to browse'}
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