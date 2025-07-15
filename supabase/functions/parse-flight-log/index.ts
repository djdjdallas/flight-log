import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { logData, storagePath, source, flightId } = await req.json()
    
    let fileContent = logData
    
    // If we have a storage path, read from storage instead
    if (storagePath && !logData) {
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from('flight-logs')
        .download(storagePath)
      
      if (downloadError) throw downloadError
      fileContent = await fileData.text()
    }

    let parsedFlight = {}

    if (source === 'dji') {
      parsedFlight = parseDJILog(fileContent)
    } else if (source === 'autel') {
      parsedFlight = parseAutelLog(fileContent)
    } else {
      throw new Error('Unsupported log source')
    }

    // Update flight record with parsed data
    const { data, error } = await supabaseClient
      .from('flights')
      .update({
        start_time: parsedFlight.startTime,
        end_time: parsedFlight.endTime,
        duration_minutes: parsedFlight.duration,
        takeoff_location: parsedFlight.takeoffLocation,
        max_altitude_ft: parsedFlight.maxAltitude,
        max_speed_mph: parsedFlight.maxSpeed,
        compliance_status: 'processed'
      })
      .eq('id', flightId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, flight: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function parseDJILog(logData) {
  try {
    // Handle different DJI log formats
    let parsedData
    
    if (logData.includes('<?xml')) {
      // DJI XML format
      parsedData = parseDJIXML(logData)
    } else if (logData.startsWith('{')) {
      // DJI JSON format
      parsedData = JSON.parse(logData)
    } else {
      // DJI CSV format
      parsedData = parseDJICSV(logData)
    }

    return extractFlightMetrics(parsedData, 'dji')
  } catch (error) {
    console.error('DJI parsing error:', error)
    throw new Error(`Failed to parse DJI log: ${error.message}`)
  }
}

function parseDJICSV(logData) {
  const lines = logData.trim().split('\n')
  if (lines.length < 2) throw new Error('Invalid CSV format')
  
  const headers = lines[0].split(',').map(h => h.trim())
  const records = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length >= headers.length) {
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim()
      })
      records.push(record)
    }
  }
  
  return records
}

function parseDJIXML(xmlData) {
  // Basic XML parsing for DJI logs
  const flightRecords = []
  const gpsRegex = /<gps.*?lat="([^"]*)".*?lng="([^"]*)".*?altitude="([^"]*)".*?\/>/g
  const timeRegex = /<time.*?value="([^"]*)".*?\/>/g
  
  let match
  while ((match = gpsRegex.exec(xmlData)) !== null) {
    flightRecords.push({
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      altitude: parseFloat(match[3])
    })
  }
  
  return flightRecords
}

function extractFlightMetrics(records, source) {
  if (!records || records.length === 0) {
    throw new Error('No flight data found in log')
  }

  // Common field mappings for different sources
  const fieldMaps = {
    dji: {
      timestamp: ['timestamp', 'time', 'datetime', 'Time'],
      latitude: ['latitude', 'lat', 'GPS_Latitude', 'OSD.latitude'],
      longitude: ['longitude', 'lng', 'GPS_Longitude', 'OSD.longitude'],
      altitude: ['altitude', 'alt', 'GPS_Height', 'OSD.altitude'],
      speed: ['speed', 'GPS_Speed', 'OSD.hSpeed'],
      battery: ['battery', 'Battery', 'OSD.batteryPercentage']
    }
  }

  const fields = fieldMaps[source] || fieldMaps.dji
  
  // Find the correct field names in the data
  const getFieldName = (possibleNames) => {
    const firstRecord = records[0]
    return possibleNames.find(name => 
      firstRecord.hasOwnProperty(name) || 
      Object.keys(firstRecord).some(key => key.toLowerCase().includes(name.toLowerCase()))
    )
  }

  const timestampField = getFieldName(fields.timestamp)
  const latField = getFieldName(fields.latitude)
  const lngField = getFieldName(fields.longitude)
  const altField = getFieldName(fields.altitude)
  const speedField = getFieldName(fields.speed)

  // Extract metrics
  const validRecords = records.filter(r => r[latField] && r[lngField])
  
  if (validRecords.length === 0) {
    throw new Error('No valid GPS coordinates found in log')
  }

  const startTime = getTimestamp(validRecords[0][timestampField])
  const endTime = getTimestamp(validRecords[validRecords.length - 1][timestampField])
  
  const altitudes = validRecords
    .map(r => parseFloat(r[altField]))
    .filter(alt => !isNaN(alt))
  
  const speeds = validRecords
    .map(r => parseFloat(r[speedField]))
    .filter(speed => !isNaN(speed))

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: Math.round((endTime - startTime) / 1000 / 60),
    takeoffLocation: {
      lat: parseFloat(validRecords[0][latField]),
      lng: parseFloat(validRecords[0][lngField]),
      address: null // To be geocoded later
    },
    landingLocation: {
      lat: parseFloat(validRecords[validRecords.length - 1][latField]),
      lng: parseFloat(validRecords[validRecords.length - 1][lngField]),
      address: null
    },
    maxAltitude: Math.max(...altitudes, 0),
    maxSpeed: Math.max(...speeds, 0),
    totalDistance: calculateTotalDistance(validRecords, latField, lngField),
    flightPath: validRecords.slice(0, 1000).map(r => ({ // Limit to 1000 points
      lat: parseFloat(r[latField]),
      lng: parseFloat(r[lngField]),
      alt: parseFloat(r[altField]) || 0,
      timestamp: getTimestamp(r[timestampField])?.toISOString()
    }))
  }
}

function getTimestamp(timeStr) {
  if (!timeStr) return new Date()
  
  // Handle various timestamp formats
  if (timeStr.includes('T') || timeStr.includes(' ')) {
    return new Date(timeStr)
  }
  
  // Unix timestamp
  if (/^\d{10}$/.test(timeStr)) {
    return new Date(parseInt(timeStr) * 1000)
  }
  
  // Millisecond timestamp
  if (/^\d{13}$/.test(timeStr)) {
    return new Date(parseInt(timeStr))
  }
  
  return new Date(timeStr)
}

function calculateTotalDistance(records, latField, lngField) {
  let totalDistance = 0
  
  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1]
    const curr = records[i]
    
    const lat1 = parseFloat(prev[latField])
    const lng1 = parseFloat(prev[lngField])
    const lat2 = parseFloat(curr[latField])
    const lng2 = parseFloat(curr[lngField])
    
    if (!isNaN(lat1) && !isNaN(lng1) && !isNaN(lat2) && !isNaN(lng2)) {
      totalDistance += haversineDistance(lat1, lng1, lat2, lng2)
    }
  }
  
  return Math.round(totalDistance)
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2-lat1) * Math.PI/180
  const Δλ = (lng2-lng1) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c // Distance in meters
}

function parseAutelLog(logData) {
  try {
    // Autel typically uses JSON format
    let parsedData
    
    if (logData.startsWith('{') || logData.startsWith('[')) {
      parsedData = JSON.parse(logData)
    } else {
      // Try CSV format for older Autel logs
      parsedData = parseAutelCSV(logData)
    }

    return extractFlightMetrics(parsedData, 'autel')
  } catch (error) {
    console.error('Autel parsing error:', error)
    throw new Error(`Failed to parse Autel log: ${error.message}`)
  }
}

function parseAutelCSV(logData) {
  const lines = logData.trim().split('\n')
  if (lines.length < 2) throw new Error('Invalid Autel CSV format')
  
  const headers = lines[0].split(',').map(h => h.trim())
  const records = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length >= headers.length) {
      const record = {}
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim()
      })
      records.push(record)
    }
  }
  
  return records
}

function extractDateTime(line) {
  // Extract timestamp from log line
  const parts = line.split(',')
  return new Date(parts[0]).toISOString()
}

function calculateDuration(lines) {
  // Calculate flight duration in minutes
  const start = new Date(lines[1].split(',')[0])
  const end = new Date(lines[lines.length - 1].split(',')[0])
  return Math.round((end - start) / 1000 / 60)
}

function extractGPS(line) {
  // Extract GPS coordinates
  const parts = line.split(',')
  return {
    lat: parseFloat(parts[2]),
    lng: parseFloat(parts[3])
  }
}