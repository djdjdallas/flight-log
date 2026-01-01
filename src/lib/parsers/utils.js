/**
 * Parser utilities for flight log processing
 */

/**
 * Haversine formula to calculate distance between two GPS coordinates
 * @param {number} lat1 - Start latitude
 * @param {number} lng1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lng2 - End longitude
 * @returns {number} Distance in feet
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 20902231 // Earth's radius in feet
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Calculate total distance traveled from GPS points
 * @param {Array} points - Array of {lat, lng} objects
 * @returns {number} Total distance in feet
 */
export function calculateTotalDistance(points) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    if (isValidCoordinate(prev.lat, prev.lng) && isValidCoordinate(curr.lat, curr.lng)) {
      total += haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng)
    }
  }
  return Math.round(total)
}

/**
 * Validate GPS coordinate
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean}
 */
export function isValidCoordinate(lat, lng) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    lat !== 0 &&
    lng !== 0 // Filter out null island
  )
}

/**
 * Parse timestamp from various formats
 * @param {string|number} value - Timestamp value
 * @param {Date} baseDate - Base date for relative timestamps
 * @returns {Date|null}
 */
export function parseTimestamp(value, baseDate = null) {
  if (!value) return null

  // Already a Date
  if (value instanceof Date) return value

  // Number - could be milliseconds offset or unix timestamp
  if (typeof value === 'number') {
    // Unix timestamp in seconds
    if (value > 1000000000 && value < 10000000000) {
      return new Date(value * 1000)
    }
    // Unix timestamp in milliseconds
    if (value > 1000000000000) {
      return new Date(value)
    }
    // Milliseconds offset from base date
    if (baseDate && value < 100000000) {
      return new Date(baseDate.getTime() + value)
    }
    return null
  }

  // String parsing
  const str = String(value).trim()

  // ISO format or standard date string
  if (str.includes('T') || str.includes('-')) {
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) return parsed
  }

  // Unix timestamp string
  if (/^\d{10}$/.test(str)) {
    return new Date(parseInt(str) * 1000)
  }
  if (/^\d{13}$/.test(str)) {
    return new Date(parseInt(str))
  }

  // Try generic parsing
  const parsed = new Date(str)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Parse CSV string into array of objects
 * @param {string} csvString - Raw CSV content
 * @param {Object} options - Parsing options
 * @returns {Array} Array of record objects
 */
export function parseCSV(csvString, options = {}) {
  const {
    delimiter = ',',
    skipEmptyLines = true,
    trimValues = true
  } = options

  const lines = csvString.split(/\r?\n/)
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  // Parse header row
  const headers = parseCSVLine(lines[0], delimiter).map(h =>
    trimValues ? h.trim() : h
  )

  // Parse data rows
  const records = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (skipEmptyLines && !line.trim()) continue

    const values = parseCSVLine(line, delimiter)
    if (values.length === 0) continue

    const record = {}
    headers.forEach((header, index) => {
      let value = values[index] ?? ''
      if (trimValues) value = value.trim()

      // Try to parse numbers
      if (value !== '' && !isNaN(value)) {
        value = parseFloat(value)
      }

      record[header] = value
    })
    records.push(record)
  }

  return records
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - CSV line
 * @param {string} delimiter - Field delimiter
 * @returns {Array} Array of field values
 */
function parseCSVLine(line, delimiter) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === delimiter) {
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

/**
 * Convert meters to feet
 * @param {number} meters
 * @returns {number}
 */
export function metersToFeet(meters) {
  return meters * 3.28084
}

/**
 * Convert meters per second to miles per hour
 * @param {number} mps
 * @returns {number}
 */
export function mpsToMph(mps) {
  return mps * 2.23694
}

/**
 * Convert kilometers per hour to miles per hour
 * @param {number} kph
 * @returns {number}
 */
export function kphToMph(kph) {
  return kph * 0.621371
}

/**
 * Find field value in record using multiple possible field names
 * @param {Object} record - Data record
 * @param {Array} possibleNames - Array of possible field names
 * @returns {*} Field value or undefined
 */
export function findField(record, possibleNames) {
  for (const name of possibleNames) {
    // Exact match
    if (record.hasOwnProperty(name)) {
      return record[name]
    }
    // Case-insensitive match
    const lowerName = name.toLowerCase()
    for (const key of Object.keys(record)) {
      if (key.toLowerCase() === lowerName) {
        return record[key]
      }
    }
  }
  return undefined
}

/**
 * Detect the format of a flight log file
 * @param {string} content - File content
 * @param {string} fileName - Original file name
 * @returns {Object} Format detection result
 */
export function detectFormat(content, fileName) {
  const lowerName = fileName.toLowerCase()
  const trimmedContent = content.trim()

  // Check for JSON format
  if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    try {
      JSON.parse(trimmedContent)
      return { type: 'json', source: detectSourceFromContent(trimmedContent) }
    } catch {
      // Not valid JSON
    }
  }

  // Check for CSV format
  if (trimmedContent.includes(',')) {
    const firstLine = trimmedContent.split('\n')[0].toLowerCase()

    // Airdata format detection
    if (firstLine.includes('datetime(utc)') || firstLine.includes('height_above_takeoff')) {
      return { type: 'csv', source: 'airdata', format: 'airdata' }
    }

    // DJI CSV format detection
    if (firstLine.includes('osd.') || firstLine.includes('gps_') ||
        firstLine.includes('flycstate') || firstLine.includes('battery')) {
      return { type: 'csv', source: 'dji', format: 'dji-csv' }
    }

    // Generic CSV with GPS data
    if (firstLine.includes('lat') && firstLine.includes('lon')) {
      return { type: 'csv', source: 'generic', format: 'generic-csv' }
    }

    return { type: 'csv', source: 'unknown', format: 'unknown-csv' }
  }

  // Check for XML format
  if (trimmedContent.startsWith('<?xml') || trimmedContent.startsWith('<')) {
    return { type: 'xml', source: 'dji', format: 'dji-xml' }
  }

  // Binary check - DJI native format
  if (isBinaryContent(trimmedContent)) {
    return { type: 'binary', source: 'dji', format: 'dji-native' }
  }

  return { type: 'unknown', source: 'unknown', format: 'unknown' }
}

/**
 * Check if content appears to be binary
 * @param {string} content
 * @returns {boolean}
 */
function isBinaryContent(content) {
  // Check for high percentage of non-printable characters
  let nonPrintable = 0
  const sample = content.slice(0, 1000)
  for (const char of sample) {
    const code = char.charCodeAt(0)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      nonPrintable++
    }
  }
  return nonPrintable / sample.length > 0.1
}

/**
 * Detect source from content keywords
 * @param {string} content
 * @returns {string}
 */
function detectSourceFromContent(content) {
  const lower = content.toLowerCase()

  // Skydio detection (check first as it's more specific)
  if (lower.includes('skydio') || lower.includes('autonomy_mode') ||
      lower.includes('tracking_mode') || lower.includes('subject_distance') ||
      lower.includes('vehicle_latitude')) {
    return 'skydio'
  }

  // Autel detection
  if (lower.includes('autel') || lower.includes('"dronelatitude"') ||
      lower.includes('remainpower') || lower.includes('homedistance') ||
      lower.includes('relativeheight')) {
    return 'autel'
  }

  // DJI detection
  if (lower.includes('dji') || lower.includes('mavic') || lower.includes('phantom') ||
      lower.includes('mini') || lower.includes('inspire') || lower.includes('matrice')) {
    return 'dji'
  }

  return 'unknown'
}

/**
 * Enhanced format detection with source-specific indicators
 * @param {string} content - File content
 * @param {string} fileName - Original file name
 * @returns {Object} Format detection result with source
 */
export function detectSourceAndFormat(content, fileName) {
  const lowerName = fileName.toLowerCase()
  const trimmedContent = content.trim()
  const lowerContent = trimmedContent.toLowerCase()

  // Check filename for source hints
  let fileNameSource = null
  if (lowerName.includes('skydio') || lowerName.includes('s2_') || lowerName.includes('x2_')) {
    fileNameSource = 'skydio'
  } else if (lowerName.includes('autel') || lowerName.includes('evo_') || lowerName.includes('evo-')) {
    fileNameSource = 'autel'
  } else if (lowerName.includes('dji') || lowerName.includes('airdata') ||
             lowerName.includes('mavic') || lowerName.includes('phantom')) {
    fileNameSource = 'dji'
  }

  // Detect format type
  let formatType = 'unknown'
  let formatDetails = 'unknown'

  // JSON check
  if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
    try {
      JSON.parse(trimmedContent)
      formatType = 'json'
    } catch {
      formatType = 'invalid-json'
    }
  }
  // CSV check
  else if (trimmedContent.includes(',')) {
    formatType = 'csv'
    const firstLine = trimmedContent.split('\n')[0].toLowerCase()

    // Specific CSV format detection
    if (firstLine.includes('datetime(utc)') || firstLine.includes('height_above_takeoff')) {
      formatDetails = 'airdata'
    } else if (firstLine.includes('osd.') || firstLine.includes('flycstate')) {
      formatDetails = 'dji-native'
    } else if (firstLine.includes('autonomy_mode') || firstLine.includes('vehicle_latitude')) {
      formatDetails = 'skydio'
    } else if (firstLine.includes('dronelatitude') || firstLine.includes('remainpower')) {
      formatDetails = 'autel'
    } else if (firstLine.includes('lat') && (firstLine.includes('lon') || firstLine.includes('lng'))) {
      formatDetails = 'generic-gps'
    }
  }
  // Binary check
  else if (isBinaryContent(trimmedContent)) {
    formatType = 'binary'
  }

  // Determine source from content if not detected from filename
  const contentSource = detectSourceFromContent(trimmedContent)
  const source = fileNameSource || contentSource ||
    (formatDetails === 'airdata' || formatDetails === 'dji-native' ? 'dji' :
     formatDetails === 'skydio' ? 'skydio' :
     formatDetails === 'autel' ? 'autel' : 'unknown')

  return {
    type: formatType,
    format: formatDetails,
    source,
    confidence: fileNameSource && contentSource === fileNameSource ? 'high' :
                fileNameSource || contentSource !== 'unknown' ? 'medium' : 'low'
  }
}
