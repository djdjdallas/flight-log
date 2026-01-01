import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Field mappings for different CSV formats
const FIELD_MAPPINGS = {
  airdata: {
    timestamp: ['datetime(utc)', 'time(millisecond)', 'datetime'],
    latitude: ['latitude', 'lat'],
    longitude: ['longitude', 'lng', 'lon'],
    altitude: ['height_above_takeoff(feet)', 'height_above_takeoff', 'altitude_above_seaLevel(feet)', 'altitude'],
    altitudeMeters: ['height_above_takeoff(meters)', 'altitude_above_seaLevel(meters)'],
    speed: ['speed(mph)', 'speed'],
    speedMps: ['speed(m/s)'],
    speedKph: ['speed(km/h)'],
    battery: ['battery_percent', 'battery(%)', 'battery'],
  },
  dji: {
    timestamp: ['time', 'timestamp', 'OSD.flyTime', 'datetime', 'Time'],
    latitude: ['OSD.latitude', 'GPS.latitude', 'latitude', 'lat', 'GPS_Latitude'],
    longitude: ['OSD.longitude', 'GPS.longitude', 'longitude', 'lng', 'lon', 'GPS_Longitude'],
    altitude: ['OSD.altitude', 'OSD.height', 'GPS.heightMSL', 'altitude', 'height', 'GPS_Height'],
    speed: ['OSD.hSpeed', 'OSD.xSpeed', 'GPS.velN', 'speed', 'GPS_Speed'],
    battery: ['BATTERY.chargePercent', 'OSD.batteryPercent', 'battery', 'Battery'],
  },
  generic: {
    timestamp: ['time', 'timestamp', 'datetime', 'date', 't'],
    latitude: ['latitude', 'lat', 'y'],
    longitude: ['longitude', 'lng', 'lon', 'x'],
    altitude: ['altitude', 'alt', 'height', 'elevation', 'z'],
    speed: ['speed', 'velocity', 'groundspeed'],
    battery: ['battery', 'battery_percent', 'batt'],
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  const { storagePath, source, flightId } = await req.json()

  try {
    // Download file from storage
    if (!storagePath) {
      throw new Error('No storage path provided')
    }

    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('flight-logs')
      .download(storagePath)

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`)
    }

    const fileContent = await fileData.text()

    // Detect format and parse
    const format = detectFormat(fileContent)
    let parsedFlight

    if (format.type === 'binary') {
      throw new Error(
        'This appears to be a native DJI binary log file. ' +
        'Please convert it to CSV using Airdata.com or PhantomHelp Flight Reader first.'
      )
    }

    if (format.type === 'csv') {
      parsedFlight = parseCSVLog(fileContent, format.format)
    } else if (format.type === 'json') {
      parsedFlight = parseJSONLog(fileContent)
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or JSON flight log.')
    }

    // Update flight record with parsed data
    const { error: flightError } = await supabaseClient
      .from('flights')
      .update({
        start_time: parsedFlight.startTime,
        end_time: parsedFlight.endTime,
        duration_minutes: parsedFlight.duration,
        takeoff_location: parsedFlight.takeoffLocation,
        landing_location: parsedFlight.landingLocation,
        max_altitude_ft: parsedFlight.maxAltitude,
        max_distance_ft: parsedFlight.maxDistance,
        max_speed_mph: parsedFlight.maxSpeed,
        compliance_status: 'pending' // Will be checked by compliance system
      })
      .eq('id', flightId)

    if (flightError) {
      throw new Error(`Failed to update flight: ${flightError.message}`)
    }

    // Update flight_logs with processed data
    const { error: logError } = await supabaseClient
      .from('flight_logs')
      .update({
        processed_data: {
          ...parsedFlight,
          // Limit flight path size for storage
          flightPath: parsedFlight.flightPath?.slice(0, 500)
        },
        import_status: 'completed'
      })
      .eq('flight_id', flightId)

    if (logError) {
      console.error('Failed to update flight_logs:', logError)
      // Don't throw - flight was updated successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          flightId,
          duration: parsedFlight.duration,
          maxAltitude: parsedFlight.maxAltitude,
          maxSpeed: parsedFlight.maxSpeed,
          maxDistance: parsedFlight.maxDistance,
          pointCount: parsedFlight.validPointCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Parse error:', error)

    // Update flight_logs with error status
    if (flightId) {
      await supabaseClient
        .from('flight_logs')
        .update({
          import_status: 'failed',
          error_message: error.message
        })
        .eq('flight_id', flightId)

      // Also update flight status
      await supabaseClient
        .from('flights')
        .update({
          compliance_status: 'import_failed'
        })
        .eq('id', flightId)
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// ============================================================================
// Format Detection
// ============================================================================

function detectFormat(content: string) {
  const trimmed = content.trim()

  // Check for JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed)
      return { type: 'json', format: 'json' }
    } catch {
      // Not valid JSON
    }
  }

  // Check for CSV
  if (trimmed.includes(',')) {
    const firstLine = trimmed.split('\n')[0].toLowerCase()

    // Airdata format
    if (firstLine.includes('datetime(utc)') || firstLine.includes('height_above_takeoff')) {
      return { type: 'csv', format: 'airdata' }
    }

    // DJI format
    if (firstLine.includes('osd.') || firstLine.includes('gps_') || firstLine.includes('flycstate')) {
      return { type: 'csv', format: 'dji' }
    }

    // Generic CSV
    if (firstLine.includes('lat') && (firstLine.includes('lon') || firstLine.includes('lng'))) {
      return { type: 'csv', format: 'generic' }
    }

    return { type: 'csv', format: 'unknown' }
  }

  // Check for binary (high percentage of non-printable chars)
  let nonPrintable = 0
  const sample = trimmed.slice(0, 500)
  for (const char of sample) {
    const code = char.charCodeAt(0)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      nonPrintable++
    }
  }
  if (nonPrintable / sample.length > 0.1) {
    return { type: 'binary', format: 'dji-native' }
  }

  return { type: 'unknown', format: 'unknown' }
}

// ============================================================================
// CSV Parsing
// ============================================================================

function parseCSVLog(content: string, format: string) {
  const records = parseCSV(content)

  if (records.length === 0) {
    throw new Error('No data records found in CSV file')
  }

  // Select field mapping based on format
  const fieldMap = selectFieldMapping(records[0], format)

  // Helper to get field value
  const getField = (record: any, fieldType: string) => {
    const possibleNames = fieldMap[fieldType] || []
    for (const name of possibleNames) {
      if (record.hasOwnProperty(name)) return record[name]
      const lowerName = name.toLowerCase()
      for (const key of Object.keys(record)) {
        if (key.toLowerCase() === lowerName) return record[key]
      }
    }
    return undefined
  }

  // Detect unit conversions needed
  const needsAltConversion = detectAltitudeUnit(records[0], fieldMap)
  const speedUnit = detectSpeedUnit(records[0])

  // Extract GPS points and metrics
  const gpsPoints: any[] = []
  let maxAltitude = 0
  let maxSpeed = 0
  let startTime: Date | null = null
  let endTime: Date | null = null
  let startBattery: number | null = null
  let endBattery: number | null = null

  for (const record of records) {
    const lat = parseFloat(getField(record, 'latitude'))
    const lng = parseFloat(getField(record, 'longitude'))

    if (!isValidCoordinate(lat, lng)) continue

    // Parse altitude with unit conversion
    let altitude = parseFloat(getField(record, 'altitude'))
    if (isNaN(altitude)) {
      altitude = parseFloat(getField(record, 'altitudeMeters'))
      if (!isNaN(altitude)) altitude = metersToFeet(altitude)
    } else if (needsAltConversion) {
      altitude = metersToFeet(altitude)
    }

    // Parse speed with unit conversion
    let speed = parseFloat(getField(record, 'speed'))
    if (isNaN(speed)) {
      const speedMps = parseFloat(getField(record, 'speedMps'))
      const speedKph = parseFloat(getField(record, 'speedKph'))
      if (!isNaN(speedMps)) speed = mpsToMph(speedMps)
      else if (!isNaN(speedKph)) speed = kphToMph(speedKph)
    } else if (speedUnit === 'mps') {
      speed = mpsToMph(speed)
    } else if (speedUnit === 'kph') {
      speed = kphToMph(speed)
    }

    // Parse timestamp
    const timestamp = getField(record, 'timestamp')
    const parsedTime = parseTimestamp(timestamp, startTime)

    // Parse battery
    const battery = parseFloat(getField(record, 'battery'))

    // Track metrics
    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed

    if (!startTime && parsedTime) {
      startTime = parsedTime
      if (!isNaN(battery)) startBattery = battery
    }
    if (parsedTime) {
      endTime = parsedTime
      if (!isNaN(battery)) endBattery = battery
    }

    gpsPoints.push({
      lat,
      lng,
      altitude: isNaN(altitude) ? 0 : Math.round(altitude),
      speed: isNaN(speed) ? 0 : Math.round(speed * 10) / 10,
      timestamp: parsedTime?.toISOString() || null
    })
  }

  if (gpsPoints.length === 0) {
    throw new Error('No valid GPS coordinates found in the flight log')
  }

  // Calculate derived metrics
  const totalDistance = calculateTotalDistance(gpsPoints)
  const maxDistance = calculateMaxDistanceFromHome(gpsPoints)
  const duration = startTime && endTime
    ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : 0

  return {
    startTime: startTime?.toISOString() || new Date().toISOString(),
    endTime: endTime?.toISOString() || new Date().toISOString(),
    duration,
    takeoffLocation: {
      lat: gpsPoints[0].lat,
      lng: gpsPoints[0].lng,
      address: null
    },
    landingLocation: {
      lat: gpsPoints[gpsPoints.length - 1].lat,
      lng: gpsPoints[gpsPoints.length - 1].lng,
      address: null
    },
    maxAltitude: Math.round(maxAltitude),
    maxSpeed: Math.round(maxSpeed * 10) / 10,
    maxDistance: Math.round(maxDistance),
    totalDistance: Math.round(totalDistance),
    batteryStart: startBattery,
    batteryEnd: endBattery,
    batteryUsed: startBattery && endBattery ? startBattery - endBattery : null,
    flightPath: sampleFlightPath(gpsPoints, 500),
    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: format === 'airdata' ? 'dji' : format,
    format: 'csv'
  }
}

function parseCSV(content: string) {
  const lines = content.split(/\r?\n/)
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim())
  const records: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const values = parseCSVLine(line)
    if (values.length === 0) continue

    const record: any = {}
    headers.forEach((header, index) => {
      let value: any = values[index]?.trim() ?? ''
      if (value !== '' && !isNaN(Number(value))) {
        value = parseFloat(value)
      }
      record[header] = value
    })
    records.push(record)
  }

  return records
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  values.push(current)

  return values
}

function selectFieldMapping(firstRecord: any, format: string) {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())

  if (headers.some(h => h.includes('datetime(utc)') || h.includes('height_above_takeoff'))) {
    return FIELD_MAPPINGS.airdata
  }
  if (headers.some(h => h.includes('osd.') || h.includes('gps.'))) {
    return FIELD_MAPPINGS.dji
  }
  return FIELD_MAPPINGS.generic
}

// ============================================================================
// JSON Parsing
// ============================================================================

function parseJSONLog(content: string) {
  const data = JSON.parse(content)
  const records = Array.isArray(data)
    ? data
    : data.flightData || data.records || data.telemetry || []

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('No flight data found in JSON file')
  }

  const gpsPoints: any[] = []
  let maxAltitude = 0
  let maxSpeed = 0
  let startTime: Date | null = null
  let endTime: Date | null = null

  for (const record of records) {
    const lat = parseFloat(record.latitude || record.lat)
    const lng = parseFloat(record.longitude || record.lng || record.lon)

    if (!isValidCoordinate(lat, lng)) continue

    const altitude = parseFloat(record.altitude || record.alt || record.height || 0)
    const speed = parseFloat(record.speed || record.groundSpeed || 0)
    const timestamp = record.timestamp || record.time || record.datetime
    const parsedTime = timestamp ? new Date(timestamp) : null

    if (!startTime && parsedTime && !isNaN(parsedTime.getTime())) {
      startTime = parsedTime
    }
    if (parsedTime && !isNaN(parsedTime.getTime())) {
      endTime = parsedTime
    }

    if (altitude > maxAltitude) maxAltitude = altitude
    if (speed > maxSpeed) maxSpeed = speed

    gpsPoints.push({ lat, lng, altitude, speed, timestamp: parsedTime?.toISOString() })
  }

  if (gpsPoints.length === 0) {
    throw new Error('No valid GPS data found in JSON file')
  }

  const duration = startTime && endTime
    ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : 0

  return {
    startTime: startTime?.toISOString() || new Date().toISOString(),
    endTime: endTime?.toISOString() || new Date().toISOString(),
    duration,
    takeoffLocation: { lat: gpsPoints[0].lat, lng: gpsPoints[0].lng, address: null },
    landingLocation: {
      lat: gpsPoints[gpsPoints.length - 1].lat,
      lng: gpsPoints[gpsPoints.length - 1].lng,
      address: null
    },
    maxAltitude: Math.round(maxAltitude),
    maxSpeed: Math.round(maxSpeed * 10) / 10,
    maxDistance: calculateMaxDistanceFromHome(gpsPoints),
    totalDistance: calculateTotalDistance(gpsPoints),
    flightPath: sampleFlightPath(gpsPoints, 500),
    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'json',
    format: 'json'
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) && !isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    (lat !== 0 || lng !== 0) // Filter null island
  )
}

function parseTimestamp(value: any, baseDate: Date | null): Date | null {
  if (!value) return null
  if (value instanceof Date) return value

  if (typeof value === 'number') {
    if (value > 1000000000 && value < 10000000000) return new Date(value * 1000)
    if (value > 1000000000000) return new Date(value)
    if (baseDate && value < 100000000) return new Date(baseDate.getTime() + value)
    return null
  }

  const str = String(value).trim()
  if (/^\d{10}$/.test(str)) return new Date(parseInt(str) * 1000)
  if (/^\d{13}$/.test(str)) return new Date(parseInt(str))

  const parsed = new Date(str)
  return isNaN(parsed.getTime()) ? null : parsed
}

function detectAltitudeUnit(firstRecord: any, fieldMap: any): boolean {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())
  if (headers.some(h => h.includes('(feet)') || h.includes('_ft'))) return false
  if (headers.some(h => h.includes('(meters)') || h.includes('(m)'))) return true
  return false
}

function detectSpeedUnit(firstRecord: any): string {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())
  if (headers.some(h => h.includes('(mph)'))) return 'mph'
  if (headers.some(h => h.includes('(m/s)') || h.includes('mps'))) return 'mps'
  if (headers.some(h => h.includes('(km/h)') || h.includes('kph'))) return 'kph'
  return 'mph'
}

function metersToFeet(meters: number): number {
  return meters * 3.28084
}

function mpsToMph(mps: number): number {
  return mps * 2.23694
}

function kphToMph(kph: number): number {
  return kph * 0.621371
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 20902231 // Earth radius in feet
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function calculateTotalDistance(points: any[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(
      points[i - 1].lat, points[i - 1].lng,
      points[i].lat, points[i].lng
    )
  }
  return Math.round(total)
}

function calculateMaxDistanceFromHome(points: any[]): number {
  if (points.length < 2) return 0
  const home = points[0]
  let maxDist = 0
  for (const point of points) {
    const dist = haversineDistance(home.lat, home.lng, point.lat, point.lng)
    if (dist > maxDist) maxDist = dist
  }
  return Math.round(maxDist)
}

function sampleFlightPath(points: any[], maxPoints: number): any[] {
  if (points.length <= maxPoints) return points
  const step = Math.ceil(points.length / maxPoints)
  const sampled = []
  for (let i = 0; i < points.length; i += step) {
    sampled.push(points[i])
  }
  if (sampled[sampled.length - 1] !== points[points.length - 1]) {
    sampled.push(points[points.length - 1])
  }
  return sampled
}
