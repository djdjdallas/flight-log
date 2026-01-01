/**
 * DJI Flight Log Parser
 *
 * Supports:
 * - Airdata CSV export format (most common)
 * - Generic DJI CSV exports from various tools
 * - DJI JSON exports
 *
 * Note: Native DJI .txt files are binary/encrypted and require
 * conversion via Airdata.com or similar tools first.
 */

import {
  parseCSV,
  parseTimestamp,
  findField,
  calculateTotalDistance,
  isValidCoordinate,
  metersToFeet,
  mpsToMph,
  kphToMph,
  detectFormat
} from './utils'

// Field mappings for different CSV formats
const FIELD_MAPPINGS = {
  // Airdata format field names
  airdata: {
    timestamp: ['datetime(utc)', 'time(millisecond)', 'datetime'],
    latitude: ['latitude', 'lat'],
    longitude: ['longitude', 'lng', 'lon'],
    altitude: ['height_above_takeoff(feet)', 'height_above_takeoff', 'altitude_above_seaLevel(feet)', 'altitude'],
    altitudeMeters: ['height_above_takeoff(meters)', 'altitude_above_seaLevel(meters)'],
    speed: ['speed(mph)', 'speed'],
    speedMps: ['speed(m/s)'],
    speedKph: ['speed(km/h)'],
    maxAltitude: ['max_altitude(feet)', 'max_altitude'],
    maxSpeed: ['max_speed(mph)', 'max_speed'],
    distance: ['distance(feet)', 'distance'],
    distanceMeters: ['distance(meters)'],
    battery: ['battery_percent', 'battery(%)', 'battery'],
    satellites: ['satellites', 'gps_num', 'numsats'],
    flightMode: ['flycstate', 'flyc_state', 'flight_mode'],
    isVideo: ['isvideo', 'is_video'],
    isPhoto: ['isphoto', 'is_photo'],
    gimbalPitch: ['gimbal_pitch(degrees)', 'gimbal_pitch'],
    compassHeading: ['compass_heading(degrees)', 'compass_heading', 'heading']
  },

  // DJI native/converted CSV format
  dji: {
    timestamp: ['time', 'timestamp', 'OSD.flyTime', 'datetime'],
    latitude: ['OSD.latitude', 'GPS.latitude', 'latitude', 'lat'],
    longitude: ['OSD.longitude', 'GPS.longitude', 'longitude', 'lng', 'lon'],
    altitude: ['OSD.altitude', 'OSD.height', 'GPS.heightMSL', 'altitude', 'height'],
    speed: ['OSD.hSpeed', 'OSD.xSpeed', 'GPS.velN', 'speed'],
    battery: ['BATTERY.chargePercent', 'OSD.batteryPercent', 'battery'],
    satellites: ['GPS.numSats', 'OSD.gpsNum', 'satellites'],
    flightMode: ['OSD.flycState', 'APPGPS.flycState', 'flightMode']
  },

  // Generic CSV format (fallback)
  generic: {
    timestamp: ['time', 'timestamp', 'datetime', 'date', 't'],
    latitude: ['latitude', 'lat', 'y'],
    longitude: ['longitude', 'lng', 'lon', 'x'],
    altitude: ['altitude', 'alt', 'height', 'elevation', 'z'],
    speed: ['speed', 'velocity', 'groundspeed'],
    battery: ['battery', 'battery_percent', 'batt'],
    satellites: ['satellites', 'sats', 'gps_sats']
  }
}

/**
 * Parse DJI flight log content
 * @param {string} content - Raw file content
 * @param {string} fileName - Original file name
 * @returns {Object} Parsed flight data
 */
export function parseDJILog(content, fileName = 'unknown.csv') {
  const format = detectFormat(content, fileName)

  if (format.type === 'binary') {
    throw new Error(
      'This appears to be a native DJI binary log file. ' +
      'Please convert it to CSV using Airdata.com or PhantomHelp Flight Reader first.'
    )
  }

  if (format.type === 'json') {
    return parseDJIJSON(content)
  }

  if (format.type === 'csv') {
    return parseDJICSV(content, format.format)
  }

  throw new Error(`Unsupported file format: ${format.type}`)
}

/**
 * Parse DJI CSV format (Airdata or converted)
 * @param {string} content - CSV content
 * @param {string} formatType - Detected format type
 * @returns {Object} Parsed flight data
 */
function parseDJICSV(content, formatType) {
  const records = parseCSV(content)

  if (records.length === 0) {
    throw new Error('No data records found in CSV file')
  }

  // Determine which field mapping to use
  const fieldMap = selectFieldMapping(records[0], formatType)

  // Extract field accessors
  const getField = (record, fieldType) => {
    const possibleNames = fieldMap[fieldType] || []
    return findField(record, possibleNames)
  }

  // Detect if we need unit conversions
  const needsAltitudeConversion = detectAltitudeUnit(records[0], fieldMap)
  const needsSpeedConversion = detectSpeedUnit(records[0], fieldMap)

  // Extract GPS points and metrics
  const gpsPoints = []
  let maxAltitude = 0
  let maxSpeed = 0
  let minBattery = 100
  let startTime = null
  let endTime = null
  let startBattery = null
  let endBattery = null

  for (const record of records) {
    const lat = parseFloat(getField(record, 'latitude'))
    const lng = parseFloat(getField(record, 'longitude'))

    if (!isValidCoordinate(lat, lng)) continue

    // Parse altitude
    let altitude = parseFloat(getField(record, 'altitude'))
    if (isNaN(altitude)) {
      altitude = parseFloat(getField(record, 'altitudeMeters'))
      if (!isNaN(altitude) && needsAltitudeConversion) {
        altitude = metersToFeet(altitude)
      }
    }

    // Parse speed
    let speed = parseFloat(getField(record, 'speed'))
    if (isNaN(speed)) {
      const speedMps = parseFloat(getField(record, 'speedMps'))
      const speedKph = parseFloat(getField(record, 'speedKph'))
      if (!isNaN(speedMps)) {
        speed = mpsToMph(speedMps)
      } else if (!isNaN(speedKph)) {
        speed = kphToMph(speedKph)
      }
    }

    // Parse timestamp
    let timestamp = getField(record, 'timestamp')
    const parsedTime = parseTimestamp(timestamp, startTime)

    // Parse battery
    const battery = parseFloat(getField(record, 'battery'))

    // Track metrics
    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed
    if (!isNaN(battery) && battery < minBattery) minBattery = battery

    // Track start/end times and battery
    if (!startTime && parsedTime) {
      startTime = parsedTime
      startBattery = battery
    }
    if (parsedTime) {
      endTime = parsedTime
      endBattery = battery
    }

    gpsPoints.push({
      lat,
      lng,
      altitude: isNaN(altitude) ? 0 : altitude,
      speed: isNaN(speed) ? 0 : speed,
      battery: isNaN(battery) ? null : battery,
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
    // Time data
    startTime: startTime?.toISOString() || new Date().toISOString(),
    endTime: endTime?.toISOString() || new Date().toISOString(),
    duration, // minutes

    // Location data
    takeoffLocation: {
      lat: gpsPoints[0].lat,
      lng: gpsPoints[0].lng,
      address: null // To be geocoded later
    },
    landingLocation: {
      lat: gpsPoints[gpsPoints.length - 1].lat,
      lng: gpsPoints[gpsPoints.length - 1].lng,
      address: null
    },

    // Flight metrics
    maxAltitude: Math.round(maxAltitude), // feet
    maxSpeed: Math.round(maxSpeed * 10) / 10, // mph, 1 decimal
    maxDistance: Math.round(maxDistance), // feet from home
    totalDistance: Math.round(totalDistance), // feet traveled

    // Battery data
    batteryStart: startBattery,
    batteryEnd: endBattery,
    batteryUsed: startBattery && endBattery ? startBattery - endBattery : null,

    // Flight path (limited to prevent huge payloads)
    flightPath: sampleFlightPath(gpsPoints, 500),

    // Metadata
    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'dji',
    format: 'csv'
  }
}

/**
 * Parse DJI JSON format
 * @param {string} content - JSON content
 * @returns {Object} Parsed flight data
 */
function parseDJIJSON(content) {
  const data = JSON.parse(content)

  // Handle array of records
  if (Array.isArray(data)) {
    // Convert to CSV-like structure and reuse CSV parser
    return parseDJICSV(
      convertJSONToCSV(data),
      'generic'
    )
  }

  // Handle single flight object with nested data
  if (data.flightData || data.records || data.telemetry) {
    const records = data.flightData || data.records || data.telemetry
    return parseDJICSV(
      convertJSONToCSV(records),
      'generic'
    )
  }

  throw new Error('Unrecognized JSON structure')
}

/**
 * Convert JSON array to CSV string
 * @param {Array} records
 * @returns {string}
 */
function convertJSONToCSV(records) {
  if (!records.length) return ''

  const headers = Object.keys(records[0])
  const lines = [headers.join(',')]

  for (const record of records) {
    const values = headers.map(h => {
      const val = record[h]
      if (val === null || val === undefined) return ''
      if (typeof val === 'string' && val.includes(',')) return `"${val}"`
      return String(val)
    })
    lines.push(values.join(','))
  }

  return lines.join('\n')
}

/**
 * Select appropriate field mapping based on CSV headers
 * @param {Object} firstRecord - First data record
 * @param {string} formatType - Detected format type
 * @returns {Object} Field mapping
 */
function selectFieldMapping(firstRecord, formatType) {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())

  // Check for Airdata format
  if (headers.some(h => h.includes('datetime(utc)') || h.includes('height_above_takeoff'))) {
    return FIELD_MAPPINGS.airdata
  }

  // Check for DJI format
  if (headers.some(h => h.includes('osd.') || h.includes('gps.'))) {
    return FIELD_MAPPINGS.dji
  }

  // Fallback to generic
  return FIELD_MAPPINGS.generic
}

/**
 * Detect if altitude values are in meters (need conversion to feet)
 * @param {Object} firstRecord
 * @param {Object} fieldMap
 * @returns {boolean}
 */
function detectAltitudeUnit(firstRecord, fieldMap) {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())

  // If explicit feet designation, no conversion needed
  if (headers.some(h => h.includes('(feet)') || h.includes('_ft'))) {
    return false
  }

  // If explicit meters designation, conversion needed
  if (headers.some(h => h.includes('(meters)') || h.includes('(m)') || h.includes('_m'))) {
    return true
  }

  // Check value ranges - if max altitude < 500, likely meters
  const altValue = findField(firstRecord, fieldMap.altitude || [])
  if (altValue && !isNaN(altValue)) {
    // DJI typically operates under 500m, so if value is reasonable for meters
    // but would be too low for feet, assume meters
    return altValue < 200
  }

  return false
}

/**
 * Detect if speed values need conversion
 * @param {Object} firstRecord
 * @param {Object} fieldMap
 * @returns {string} Unit type: 'mph', 'mps', 'kph'
 */
function detectSpeedUnit(firstRecord, fieldMap) {
  const headers = Object.keys(firstRecord).map(h => h.toLowerCase())

  if (headers.some(h => h.includes('(mph)'))) return 'mph'
  if (headers.some(h => h.includes('(m/s)') || h.includes('mps'))) return 'mps'
  if (headers.some(h => h.includes('(km/h)') || h.includes('kph'))) return 'kph'

  return 'mph' // Default assumption
}

/**
 * Calculate maximum distance from home point (first GPS coordinate)
 * @param {Array} points - GPS points
 * @returns {number} Max distance in feet
 */
function calculateMaxDistanceFromHome(points) {
  if (points.length < 2) return 0

  const home = points[0]
  let maxDist = 0

  for (const point of points) {
    const dist = haversineDistanceFeet(home.lat, home.lng, point.lat, point.lng)
    if (dist > maxDist) maxDist = dist
  }

  return maxDist
}

/**
 * Haversine distance in feet
 */
function haversineDistanceFeet(lat1, lng1, lat2, lng2) {
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

/**
 * Sample flight path to reduce data size
 * @param {Array} points - All GPS points
 * @param {number} maxPoints - Maximum points to return
 * @returns {Array} Sampled points
 */
function sampleFlightPath(points, maxPoints) {
  if (points.length <= maxPoints) return points

  const step = Math.ceil(points.length / maxPoints)
  const sampled = []

  for (let i = 0; i < points.length; i += step) {
    sampled.push(points[i])
  }

  // Always include last point
  if (sampled[sampled.length - 1] !== points[points.length - 1]) {
    sampled.push(points[points.length - 1])
  }

  return sampled
}

/**
 * Validate parsed flight data
 * @param {Object} flightData - Parsed flight data
 * @returns {Object} Validation result
 */
export function validateFlightData(flightData) {
  const errors = []
  const warnings = []

  // Required fields
  if (!flightData.startTime) errors.push('Missing start time')
  if (!flightData.takeoffLocation?.lat) errors.push('Missing takeoff location')

  // Sanity checks
  if (flightData.maxAltitude > 50000) {
    warnings.push('Unusually high altitude detected - values may be in wrong units')
  }
  if (flightData.maxSpeed > 500) {
    warnings.push('Unusually high speed detected - values may be in wrong units')
  }
  if (flightData.duration > 480) {
    warnings.push('Flight duration exceeds 8 hours - verify timestamps')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export default {
  parseDJILog,
  validateFlightData
}
