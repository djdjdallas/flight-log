/**
 * Autel Flight Log Parser
 *
 * Supports:
 * - Autel Sky app JSON exports
 * - Autel Sky app CSV exports
 * - Autel Explorer/Voyager app exports
 *
 * Tested with: EVO Lite, EVO II series, EVO Nano series
 */

import {
  parseCSV,
  parseTimestamp,
  findField,
  calculateTotalDistance,
  isValidCoordinate,
  metersToFeet,
  mpsToMph,
  kphToMph
} from './utils'

// Field mappings for Autel formats
const AUTEL_FIELD_MAPPINGS = {
  // Autel Sky app JSON format
  skyJson: {
    timestamp: ['timestamp', 'time', 'datetime', 'recordTime', 'flyTime'],
    latitude: ['latitude', 'lat', 'gpsLatitude', 'droneLatitude'],
    longitude: ['longitude', 'lng', 'lon', 'gpsLongitude', 'droneLongitude'],
    altitude: ['altitude', 'alt', 'height', 'relativeHeight', 'absoluteHeight'],
    speed: ['speed', 'groundSpeed', 'horizontalSpeed', 'hSpeed'],
    verticalSpeed: ['verticalSpeed', 'vSpeed', 'climbRate'],
    battery: ['batteryPercent', 'battery', 'batteryLevel', 'remainPower'],
    satellites: ['satellites', 'gpsNum', 'satCount', 'gpsCount'],
    distance: ['distance', 'homeDistance', 'distanceFromHome'],
    heading: ['heading', 'yaw', 'compassHeading', 'droneYaw'],
    gimbalPitch: ['gimbalPitch', 'cameraPitch', 'pitch'],
    flightMode: ['flightMode', 'flyMode', 'mode'],
    isRecording: ['isRecording', 'recording', 'videoRecording']
  },

  // Autel CSV export format
  skyCsv: {
    timestamp: ['time', 'timestamp', 'datetime', 'Time(s)', 'Time'],
    latitude: ['latitude', 'lat', 'Latitude', 'GPS.latitude'],
    longitude: ['longitude', 'lng', 'lon', 'Longitude', 'GPS.longitude'],
    altitude: ['altitude', 'alt', 'height', 'Altitude(m)', 'Height(m)', 'RelativeHeight'],
    speed: ['speed', 'Speed(m/s)', 'HSpeed(m/s)', 'groundSpeed'],
    battery: ['battery', 'Battery(%)', 'BatteryPercent', 'remainPower'],
    satellites: ['satellites', 'GPS.satCount', 'SatCount'],
    distance: ['distance', 'Distance(m)', 'HomeDistance']
  }
}

/**
 * Parse Autel flight log content
 * @param {string} content - Raw file content
 * @param {string} fileName - Original file name
 * @returns {Object} Parsed flight data
 */
export function parseAutelLog(content, fileName = 'unknown') {
  const trimmed = content.trim()

  // Detect format
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseAutelJSON(content)
  }

  // CSV format
  return parseAutelCSV(content, fileName)
}

/**
 * Parse Autel JSON format (from Autel Sky app)
 * @param {string} content - JSON content
 * @returns {Object} Parsed flight data
 */
function parseAutelJSON(content) {
  const data = JSON.parse(content)

  // Handle different JSON structures
  let records = extractRecords(data)

  if (!records || records.length === 0) {
    throw new Error('No flight telemetry data found in Autel JSON file')
  }

  const fieldMap = AUTEL_FIELD_MAPPINGS.skyJson

  // Extract flight metadata if available
  const metadata = extractMetadata(data)

  const gpsPoints = []
  let maxAltitude = 0
  let maxSpeed = 0
  let maxDistance = 0
  let minBattery = 100
  let startTime = null
  let endTime = null
  let startBattery = null
  let endBattery = null

  for (const record of records) {
    const lat = parseFloat(findField(record, fieldMap.latitude))
    const lng = parseFloat(findField(record, fieldMap.longitude))

    if (!isValidCoordinate(lat, lng)) continue

    // Parse altitude (Autel typically uses meters)
    let altitude = parseFloat(findField(record, fieldMap.altitude))
    if (!isNaN(altitude)) {
      altitude = metersToFeet(altitude)
    }

    // Parse speed (Autel typically uses m/s)
    let speed = parseFloat(findField(record, fieldMap.speed))
    if (!isNaN(speed)) {
      speed = mpsToMph(speed)
    }

    // Parse distance (meters)
    let distance = parseFloat(findField(record, fieldMap.distance))
    if (!isNaN(distance)) {
      distance = metersToFeet(distance)
    }

    // Parse timestamp
    const timestamp = findField(record, fieldMap.timestamp)
    const parsedTime = parseTimestamp(timestamp, startTime)

    // Parse battery
    const battery = parseFloat(findField(record, fieldMap.battery))

    // Track metrics
    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed
    if (!isNaN(distance) && distance > maxDistance) maxDistance = distance
    if (!isNaN(battery) && battery < minBattery) minBattery = battery

    // Track start/end
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
      distance: isNaN(distance) ? 0 : distance,
      battery: isNaN(battery) ? null : battery,
      timestamp: parsedTime?.toISOString() || null
    })
  }

  if (gpsPoints.length === 0) {
    throw new Error('No valid GPS coordinates found in Autel flight log')
  }

  // Calculate metrics
  const totalDistance = calculateTotalDistance(gpsPoints)
  const calculatedMaxDistance = calculateMaxDistanceFromHome(gpsPoints)
  const duration = startTime && endTime
    ? Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : metadata.duration || 0

  return {
    startTime: startTime?.toISOString() || metadata.startTime || new Date().toISOString(),
    endTime: endTime?.toISOString() || metadata.endTime || new Date().toISOString(),
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
    maxDistance: Math.round(maxDistance || calculatedMaxDistance),
    totalDistance: Math.round(totalDistance),

    batteryStart: startBattery,
    batteryEnd: endBattery,
    batteryUsed: startBattery && endBattery ? Math.round(startBattery - endBattery) : null,

    flightPath: sampleFlightPath(gpsPoints, 500),

    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'autel',
    format: 'json',

    // Autel-specific metadata
    droneModel: metadata.droneModel,
    firmwareVersion: metadata.firmwareVersion
  }
}

/**
 * Parse Autel CSV format
 * @param {string} content - CSV content
 * @param {string} fileName - File name
 * @returns {Object} Parsed flight data
 */
function parseAutelCSV(content, fileName) {
  const records = parseCSV(content)

  if (records.length === 0) {
    throw new Error('No data records found in Autel CSV file')
  }

  const fieldMap = AUTEL_FIELD_MAPPINGS.skyCsv

  // Detect unit types from headers
  const headers = Object.keys(records[0])
  const altitudeInMeters = headers.some(h =>
    h.toLowerCase().includes('(m)') || h.toLowerCase().includes('meter')
  )
  const speedInMps = headers.some(h =>
    h.toLowerCase().includes('m/s') || h.toLowerCase().includes('mps')
  )

  const gpsPoints = []
  let maxAltitude = 0
  let maxSpeed = 0
  let maxDistance = 0
  let minBattery = 100
  let startTime = null
  let endTime = null
  let startBattery = null
  let endBattery = null

  for (const record of records) {
    const lat = parseFloat(findField(record, fieldMap.latitude))
    const lng = parseFloat(findField(record, fieldMap.longitude))

    if (!isValidCoordinate(lat, lng)) continue

    // Parse altitude
    let altitude = parseFloat(findField(record, fieldMap.altitude))
    if (!isNaN(altitude) && altitudeInMeters) {
      altitude = metersToFeet(altitude)
    }

    // Parse speed
    let speed = parseFloat(findField(record, fieldMap.speed))
    if (!isNaN(speed) && speedInMps) {
      speed = mpsToMph(speed)
    }

    // Parse distance
    let distance = parseFloat(findField(record, fieldMap.distance))
    if (!isNaN(distance)) {
      distance = metersToFeet(distance)
    }

    // Parse timestamp
    const timestamp = findField(record, fieldMap.timestamp)
    const parsedTime = parseTimestamp(timestamp, startTime)

    // Parse battery
    const battery = parseFloat(findField(record, fieldMap.battery))

    // Track metrics
    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed
    if (!isNaN(distance) && distance > maxDistance) maxDistance = distance
    if (!isNaN(battery) && battery < minBattery) minBattery = battery

    // Track start/end
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
    throw new Error('No valid GPS coordinates found in Autel CSV')
  }

  const totalDistance = calculateTotalDistance(gpsPoints)
  const calculatedMaxDistance = calculateMaxDistanceFromHome(gpsPoints)
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
    maxDistance: Math.round(maxDistance || calculatedMaxDistance),
    totalDistance: Math.round(totalDistance),

    batteryStart: startBattery,
    batteryEnd: endBattery,
    batteryUsed: startBattery && endBattery ? Math.round(startBattery - endBattery) : null,

    flightPath: sampleFlightPath(gpsPoints, 500),

    recordCount: records.length,
    validPointCount: gpsPoints.length,
    source: 'autel',
    format: 'csv'
  }
}

/**
 * Extract records array from various Autel JSON structures
 */
function extractRecords(data) {
  // Direct array
  if (Array.isArray(data)) {
    return data
  }

  // Common nested structures
  const possiblePaths = [
    'flightData',
    'telemetry',
    'records',
    'data',
    'flightRecords',
    'gpsData',
    'flight.telemetry',
    'flight.records'
  ]

  for (const path of possiblePaths) {
    const parts = path.split('.')
    let current = data

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        current = null
        break
      }
    }

    if (Array.isArray(current) && current.length > 0) {
      return current
    }
  }

  // Try to find any array with GPS-like data
  for (const key of Object.keys(data)) {
    const value = data[key]
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0]
      if (first && (first.latitude || first.lat || first.gpsLatitude)) {
        return value
      }
    }
  }

  return null
}

/**
 * Extract metadata from Autel JSON
 */
function extractMetadata(data) {
  const metadata = {
    droneModel: null,
    firmwareVersion: null,
    startTime: null,
    endTime: null,
    duration: null
  }

  // Common metadata fields
  metadata.droneModel = data.droneModel || data.aircraftModel || data.model ||
    data.deviceModel || data.aircraft?.model
  metadata.firmwareVersion = data.firmwareVersion || data.version ||
    data.aircraft?.firmwareVersion
  metadata.startTime = data.startTime || data.takeoffTime || data.flightStartTime
  metadata.endTime = data.endTime || data.landingTime || data.flightEndTime
  metadata.duration = data.duration || data.flightDuration || data.totalTime

  // Convert duration from seconds to minutes if needed
  if (metadata.duration && metadata.duration > 1000) {
    metadata.duration = Math.round(metadata.duration / 60)
  }

  return metadata
}

/**
 * Calculate maximum distance from home point
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
 */
function sampleFlightPath(points, maxPoints) {
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
 * Detect if content is Autel format
 * @param {string} content - File content
 * @param {string} fileName - File name
 * @returns {boolean}
 */
export function isAutelFormat(content, fileName) {
  const lower = content.toLowerCase()
  const lowerName = fileName.toLowerCase()

  // Check filename
  if (lowerName.includes('autel') || lowerName.includes('evo')) {
    return true
  }

  // Check content for Autel indicators
  const autelIndicators = [
    'autel',
    'evo',
    'dronelatitude',
    'dronelongitude',
    'remainpower',
    'homedistance',
    'relativeheight'
  ]

  return autelIndicators.some(indicator => lower.includes(indicator))
}

export default {
  parseAutelLog,
  isAutelFormat
}
