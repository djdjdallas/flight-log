/**
 * Flight Log Parser Library
 *
 * Unified interface for parsing flight logs from various drone manufacturers.
 *
 * Supported formats:
 * - DJI: Airdata CSV exports, converted CSV files
 * - Autel: JSON and CSV exports from Autel Sky app
 * - Skydio: CSV and JSON exports from Skydio app/cloud
 * - Generic: Any CSV with GPS data
 *
 * Usage:
 *   import { parseFlightLog } from '@/lib/parsers'
 *   const result = parseFlightLog(fileContent, fileName)
 */

import { parseDJILog, validateFlightData } from './dji'
import { parseAutelLog, isAutelFormat } from './autel'
import { parseSkydioLog, isSkydioFormat } from './skydio'
import { detectFormat, detectSourceAndFormat, parseCSV, isValidCoordinate, calculateTotalDistance } from './utils'

/**
 * Parse a flight log file and extract flight data
 * @param {string} content - Raw file content
 * @param {string} fileName - Original file name
 * @param {Object} options - Parser options
 * @returns {Object} Parsed flight data and metadata
 */
export function parseFlightLog(content, fileName = 'unknown', options = {}) {
  const startTime = Date.now()

  try {
    // Enhanced format detection
    const format = detectSourceAndFormat(content, fileName)

    // Handle binary files (native DJI)
    if (format.type === 'binary') {
      throw new Error(
        'This appears to be a native DJI binary log file (.txt). ' +
        'Please convert it to CSV using Airdata.com first, then upload the CSV file.'
      )
    }

    // Handle invalid JSON
    if (format.type === 'invalid-json') {
      throw new Error('The file appears to be JSON but is not valid. Please check the file format.')
    }

    let parsedData
    let parserUsed

    // Route to appropriate parser based on detected source
    switch (format.source) {
      case 'dji':
        parsedData = parseDJILog(content, fileName)
        parserUsed = 'dji'
        break

      case 'autel':
        parsedData = parseAutelLog(content, fileName)
        parserUsed = 'autel'
        break

      case 'skydio':
        parsedData = parseSkydioLog(content, fileName)
        parserUsed = 'skydio'
        break

      default:
        // Try format-specific detection as fallback
        if (isSkydioFormat(content, fileName)) {
          parsedData = parseSkydioLog(content, fileName)
          parserUsed = 'skydio'
        } else if (isAutelFormat(content, fileName)) {
          parsedData = parseAutelLog(content, fileName)
          parserUsed = 'autel'
        } else if (format.type === 'csv') {
          // Try generic CSV parser
          parsedData = parseGenericCSV(content, fileName)
          parserUsed = 'generic'
        } else if (format.type === 'json') {
          // Try to parse as generic JSON with GPS data
          parsedData = parseGenericJSON(content)
          parserUsed = 'generic-json'
        } else {
          throw new Error(
            'Unsupported file format. Please upload a CSV or JSON file exported from ' +
            'Airdata, Autel Sky, Skydio, or your drone\'s companion app.'
          )
        }
    }

    // Validate parsed data
    const validation = validateFlightData(parsedData)

    return {
      success: true,
      data: parsedData,
      validation,
      metadata: {
        fileName,
        format: format.format,
        source: format.source,
        parserUsed,
        confidence: format.confidence,
        parseTimeMs: Date.now() - startTime
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      metadata: {
        fileName,
        parseTimeMs: Date.now() - startTime
      }
    }
  }
}

/**
 * Parse generic CSV with GPS data
 * @param {string} content - CSV content
 * @param {string} fileName - File name
 * @returns {Object} Parsed flight data
 */
function parseGenericCSV(content, fileName) {
  const records = parseCSV(content)

  if (records.length === 0) {
    throw new Error('No data found in CSV file')
  }

  // Try to find GPS columns
  const headers = Object.keys(records[0]).map(h => h.toLowerCase())
  const latCol = findColumn(headers, ['latitude', 'lat', 'y'])
  const lngCol = findColumn(headers, ['longitude', 'lng', 'lon', 'x'])

  if (!latCol || !lngCol) {
    throw new Error('Could not find latitude/longitude columns in CSV')
  }

  const altCol = findColumn(headers, ['altitude', 'alt', 'height', 'elevation', 'z'])
  const speedCol = findColumn(headers, ['speed', 'velocity', 'groundspeed'])
  const timeCol = findColumn(headers, ['time', 'timestamp', 'datetime', 'date'])
  const batteryCol = findColumn(headers, ['battery', 'battery_percent', 'batt'])

  const gpsPoints = []
  let maxAltitude = 0
  let maxSpeed = 0
  let startTime = null
  let endTime = null
  let startBattery = null
  let endBattery = null

  for (const record of records) {
    const lat = parseFloat(getRecordValue(record, latCol))
    const lng = parseFloat(getRecordValue(record, lngCol))

    if (!isValidCoordinate(lat, lng)) continue

    const altitude = altCol ? parseFloat(getRecordValue(record, altCol)) || 0 : 0
    const speed = speedCol ? parseFloat(getRecordValue(record, speedCol)) || 0 : 0
    const timestamp = timeCol ? getRecordValue(record, timeCol) : null
    const parsedTime = timestamp ? new Date(timestamp) : null
    const battery = batteryCol ? parseFloat(getRecordValue(record, batteryCol)) : null

    if (!startTime && parsedTime && !isNaN(parsedTime.getTime())) {
      startTime = parsedTime
      startBattery = battery
    }
    if (parsedTime && !isNaN(parsedTime.getTime())) {
      endTime = parsedTime
      endBattery = battery
    }

    if (altitude > maxAltitude) maxAltitude = altitude
    if (speed > maxSpeed) maxSpeed = speed

    gpsPoints.push({
      lat,
      lng,
      altitude,
      speed,
      battery,
      timestamp: parsedTime?.toISOString() || null
    })
  }

  if (gpsPoints.length === 0) {
    throw new Error('No valid GPS coordinates found in CSV')
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
    maxDistance: calculateMaxDistance(gpsPoints),
    totalDistance: calculateTotalDistance(gpsPoints),
    batteryStart: startBattery,
    batteryEnd: endBattery,
    batteryUsed: startBattery && endBattery ? Math.round(startBattery - endBattery) : null,
    flightPath: samplePath(gpsPoints, 500),
    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'generic',
    format: 'csv'
  }
}

/**
 * Parse generic JSON with GPS data
 * @param {string} content - JSON content
 * @returns {Object} Parsed flight data
 */
function parseGenericJSON(content) {
  const data = JSON.parse(content)

  // Try to find an array of records
  let records = Array.isArray(data) ? data : null

  if (!records) {
    // Search for common nested paths
    const paths = ['data', 'records', 'telemetry', 'flightData', 'points', 'positions']
    for (const path of paths) {
      if (data[path] && Array.isArray(data[path])) {
        records = data[path]
        break
      }
    }
  }

  if (!records || records.length === 0) {
    throw new Error('No telemetry data array found in JSON')
  }

  const gpsPoints = []
  let maxAltitude = 0
  let maxSpeed = 0
  let startTime = null
  let endTime = null

  for (const record of records) {
    const lat = parseFloat(record.latitude || record.lat || record.y)
    const lng = parseFloat(record.longitude || record.lng || record.lon || record.x)

    if (!isValidCoordinate(lat, lng)) continue

    const altitude = parseFloat(record.altitude || record.alt || record.height || 0)
    const speed = parseFloat(record.speed || record.velocity || 0)
    const timestamp = record.timestamp || record.time || record.datetime
    const parsedTime = timestamp ? new Date(timestamp) : null

    if (!startTime && parsedTime) startTime = parsedTime
    if (parsedTime) endTime = parsedTime

    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed

    gpsPoints.push({
      lat,
      lng,
      altitude: isNaN(altitude) ? 0 : altitude,
      speed: isNaN(speed) ? 0 : speed,
      timestamp: parsedTime?.toISOString() || null
    })
  }

  if (gpsPoints.length === 0) {
    throw new Error('No valid GPS data found in JSON')
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
    maxDistance: calculateMaxDistance(gpsPoints),
    totalDistance: calculateTotalDistance(gpsPoints),
    flightPath: samplePath(gpsPoints, 500),
    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'generic',
    format: 'json'
  }
}

/**
 * Find matching column name in headers
 */
function findColumn(headers, possibleNames) {
  for (const name of possibleNames) {
    const match = headers.find(h => h === name || h.includes(name))
    if (match) return match
  }
  return null
}

/**
 * Get value from record with case-insensitive key matching
 */
function getRecordValue(record, key) {
  if (record.hasOwnProperty(key)) return record[key]
  const lowerKey = key.toLowerCase()
  for (const k of Object.keys(record)) {
    if (k.toLowerCase() === lowerKey) return record[k]
  }
  return null
}

/**
 * Calculate max distance from home point
 */
function calculateMaxDistance(points) {
  if (points.length < 2) return 0

  const home = points[0]
  let maxDist = 0

  for (const point of points) {
    const dist = haversine(home.lat, home.lng, point.lat, point.lng)
    if (dist > maxDist) maxDist = dist
  }

  return Math.round(maxDist * 3.28084) // meters to feet
}

/**
 * Haversine formula - returns meters
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000
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
 * Sample path to reduce points
 */
function samplePath(points, maxPoints) {
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

/**
 * Get supported file formats
 * @returns {Object} Supported formats information
 */
export function getSupportedFormats() {
  return {
    dji: {
      name: 'DJI',
      extensions: ['.csv'],
      description: 'Export your flight logs via Airdata.com or PhantomHelp Flight Reader',
      models: ['Mavic', 'Mini', 'Air', 'Phantom', 'Inspire', 'Matrice'],
      instructions: [
        'Go to Airdata.com and sync your flights',
        'Select a flight and click "Download CSV"',
        'Upload the downloaded CSV file here'
      ]
    },
    autel: {
      name: 'Autel',
      extensions: ['.json', '.csv'],
      description: 'Export flight logs from the Autel Sky app',
      models: ['EVO Lite', 'EVO II', 'EVO Nano', 'EVO Max'],
      instructions: [
        'Open the Autel Sky app',
        'Go to Flight Records',
        'Export the flight as JSON or CSV'
      ]
    },
    skydio: {
      name: 'Skydio',
      extensions: ['.csv', '.json'],
      description: 'Export flight logs from the Skydio app or cloud',
      models: ['Skydio 2', 'Skydio 2+', 'Skydio X2'],
      instructions: [
        'Open the Skydio app or cloud.skydio.com',
        'Go to Flight History',
        'Download flight data as CSV'
      ]
    },
    generic: {
      name: 'Generic GPS',
      extensions: ['.csv', '.json'],
      description: 'Any CSV or JSON file with latitude and longitude data',
      requirements: ['latitude/lat column', 'longitude/lng/lon column']
    }
  }
}

// Re-export utilities for external use
export { detectFormat, detectSourceAndFormat } from './utils'
export { validateFlightData } from './dji'
export { isAutelFormat } from './autel'
export { isSkydioFormat } from './skydio'
