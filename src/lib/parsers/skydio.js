/**
 * Skydio Flight Log Parser
 *
 * Supports:
 * - Skydio app CSV exports
 * - Skydio Cloud exports
 * - Skydio 2/2+, X2 series flight logs
 *
 * Skydio logs typically include:
 * - GPS telemetry (lat, lng, altitude)
 * - Flight metrics (speed, distance, battery)
 * - Autonomy data (tracking mode, subject position)
 */

import {
  parseCSV,
  parseTimestamp,
  findField,
  calculateTotalDistance,
  isValidCoordinate,
  metersToFeet,
  mpsToMph
} from './utils'

// Field mappings for Skydio formats
const SKYDIO_FIELD_MAPPINGS = {
  // Standard Skydio CSV export
  standard: {
    timestamp: ['timestamp', 'time', 'time_utc', 'datetime', 'elapsed_time', 'flight_time'],
    latitude: ['latitude', 'lat', 'gps_latitude', 'vehicle_latitude', 'drone_lat'],
    longitude: ['longitude', 'lng', 'lon', 'gps_longitude', 'vehicle_longitude', 'drone_lon'],
    altitude: ['altitude', 'alt', 'height', 'altitude_msl', 'altitude_agl', 'height_above_ground', 'relative_altitude'],
    speed: ['speed', 'ground_speed', 'horizontal_speed', 'velocity', 'vehicle_speed'],
    verticalSpeed: ['vertical_speed', 'climb_rate', 'vspeed'],
    battery: ['battery', 'battery_percent', 'battery_level', 'remaining_battery', 'soc'],
    satellites: ['satellites', 'gps_satellites', 'num_satellites', 'sat_count'],
    distance: ['distance', 'distance_from_home', 'home_distance', 'range'],
    heading: ['heading', 'yaw', 'vehicle_heading', 'drone_yaw'],
    gimbalPitch: ['gimbal_pitch', 'camera_pitch', 'gimbal_tilt'],
    flightMode: ['flight_mode', 'autonomy_mode', 'tracking_mode', 'mode'],
    subjectDistance: ['subject_distance', 'target_distance', 'tracking_distance'],
    isRecording: ['recording', 'is_recording', 'video_recording']
  },

  // Skydio Cloud export format
  cloud: {
    timestamp: ['recorded_at', 'timestamp', 'time'],
    latitude: ['latitude', 'lat', 'position.latitude'],
    longitude: ['longitude', 'lon', 'position.longitude'],
    altitude: ['altitude', 'height', 'position.altitude'],
    speed: ['speed', 'velocity.horizontal'],
    battery: ['battery_percentage', 'battery'],
    flightMode: ['flight_mode', 'mode']
  }
}

/**
 * Parse Skydio flight log content
 * @param {string} content - Raw file content
 * @param {string} fileName - Original file name
 * @returns {Object} Parsed flight data
 */
export function parseSkydioLog(content, fileName = 'unknown') {
  const trimmed = content.trim()

  // Skydio can export JSON from cloud
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseSkydioJSON(content)
  }

  // CSV format (most common)
  return parseSkydioCSV(content, fileName)
}

/**
 * Parse Skydio JSON format (from Skydio Cloud)
 * @param {string} content - JSON content
 * @returns {Object} Parsed flight data
 */
function parseSkydioJSON(content) {
  const data = JSON.parse(content)

  // Handle different JSON structures
  let records = extractSkydioRecords(data)

  if (!records || records.length === 0) {
    throw new Error('No flight telemetry data found in Skydio JSON file')
  }

  const fieldMap = SKYDIO_FIELD_MAPPINGS.cloud
  const metadata = extractSkydioMetadata(data)

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

    // Parse altitude (Skydio uses meters)
    let altitude = parseFloat(findField(record, fieldMap.altitude))
    if (!isNaN(altitude)) {
      altitude = metersToFeet(altitude)
    }

    // Parse speed (Skydio uses m/s)
    let speed = parseFloat(findField(record, fieldMap.speed))
    if (!isNaN(speed)) {
      speed = mpsToMph(speed)
    }

    // Parse timestamp
    const timestamp = findField(record, fieldMap.timestamp)
    const parsedTime = parseTimestamp(timestamp, startTime)

    // Parse battery
    const battery = parseFloat(findField(record, fieldMap.battery))

    // Track metrics
    if (!isNaN(altitude) && altitude > maxAltitude) maxAltitude = altitude
    if (!isNaN(speed) && speed > maxSpeed) maxSpeed = speed
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
    throw new Error('No valid GPS coordinates found in Skydio flight log')
  }

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
    source: 'skydio',
    format: 'json',

    // Skydio-specific metadata
    droneModel: metadata.droneModel,
    serialNumber: metadata.serialNumber
  }
}

/**
 * Parse Skydio CSV format
 * @param {string} content - CSV content
 * @param {string} fileName - File name
 * @returns {Object} Parsed flight data
 */
function parseSkydioCSV(content, fileName) {
  const records = parseCSV(content)

  if (records.length === 0) {
    throw new Error('No data records found in Skydio CSV file')
  }

  const fieldMap = SKYDIO_FIELD_MAPPINGS.standard

  // Detect units from headers
  const headers = Object.keys(records[0])
  const altitudeInMeters = !headers.some(h =>
    h.toLowerCase().includes('(ft)') || h.toLowerCase().includes('feet')
  )
  const speedInMps = !headers.some(h =>
    h.toLowerCase().includes('mph') || h.toLowerCase().includes('mi/h')
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
    if (!isNaN(distance) && altitudeInMeters) {
      // Assume distance uses same units as altitude
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
    throw new Error('No valid GPS coordinates found in Skydio CSV')
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
    source: 'skydio',
    format: 'csv'
  }
}

/**
 * Extract records from Skydio JSON structures
 */
function extractSkydioRecords(data) {
  if (Array.isArray(data)) {
    return data
  }

  const possiblePaths = [
    'telemetry',
    'flight_data',
    'records',
    'data',
    'positions',
    'flight.telemetry',
    'flight.positions'
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

  return null
}

/**
 * Extract metadata from Skydio JSON
 */
function extractSkydioMetadata(data) {
  const metadata = {
    droneModel: null,
    serialNumber: null,
    startTime: null,
    endTime: null,
    duration: null
  }

  metadata.droneModel = data.vehicle_type || data.drone_model || data.model ||
    data.aircraft?.model || 'Skydio'
  metadata.serialNumber = data.serial_number || data.vehicle_serial ||
    data.aircraft?.serial
  metadata.startTime = data.start_time || data.flight_start || data.takeoff_time
  metadata.endTime = data.end_time || data.flight_end || data.landing_time
  metadata.duration = data.duration || data.flight_duration

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
  const R = 20902231
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
 * Sample flight path
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
 * Detect if content is Skydio format
 * @param {string} content - File content
 * @param {string} fileName - File name
 * @returns {boolean}
 */
export function isSkydioFormat(content, fileName) {
  const lower = content.toLowerCase()
  const lowerName = fileName.toLowerCase()

  // Check filename
  if (lowerName.includes('skydio') || lowerName.includes('s2') || lowerName.includes('x2')) {
    return true
  }

  // Check content for Skydio indicators
  const skydioIndicators = [
    'skydio',
    'autonomy_mode',
    'tracking_mode',
    'subject_distance',
    'vehicle_latitude',
    'vehicle_longitude',
    'vehicle_heading'
  ]

  return skydioIndicators.some(indicator => lower.includes(indicator))
}

export default {
  parseSkydioLog,
  isSkydioFormat
}
