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

    const { logData, source, flightId } = await req.json()

    let parsedFlight = {}

    if (source === 'dji') {
      parsedFlight = parseDJILog(logData)
    } else if (source === 'autel') {
      parsedFlight = parseAutelLog(logData)
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
  // DJI log parsing logic
  // Parse CSV or JSON format from DJI GO/Fly apps
  const lines = logData.split('\n')
  const headers = lines[0].split(',')
  
  // Extract key data points
  const flightData = {
    startTime: extractDateTime(lines[1]),
    endTime: extractDateTime(lines[lines.length - 1]),
    duration: calculateDuration(lines),
    takeoffLocation: extractGPS(lines[1]),
    maxAltitude: Math.max(...lines.slice(1).map(line => parseFloat(line.split(',')[5]) || 0)),
    maxSpeed: Math.max(...lines.slice(1).map(line => parseFloat(line.split(',')[7]) || 0))
  }

  return flightData
}

function parseAutelLog(logData) {
  // Autel log parsing logic
  // Similar structure but different data format
  return {
    // Parsed Autel data
  }
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