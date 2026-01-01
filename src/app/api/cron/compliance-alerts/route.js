import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  sendRegistrationExpiryAlert,
  sendPart107ExpiryAlert,
  sendWeeklySummary
} from '@/lib/email'

// Use service role for cron jobs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Days before expiry to send alerts
const ALERT_THRESHOLDS = {
  registration: [30, 14, 7, 3, 1],
  part107: [60, 30, 14, 7]
}

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    registrationAlerts: 0,
    part107Alerts: 0,
    weeklySummaries: 0,
    errors: []
  }

  try {
    // Check registration expiries
    await checkRegistrationExpiries(results)

    // Check Part 107 expiries
    await checkPart107Expiries(results)

    // Send weekly summaries (only on Mondays)
    const today = new Date()
    if (today.getDay() === 1) {
      await sendWeeklySummaries(results)
    }

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error.message, results },
      { status: 500 }
    )
  }
}

async function checkRegistrationExpiries(results) {
  const today = new Date()

  for (const days of ALERT_THRESHOLDS.registration) {
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + days)
    const dateStr = targetDate.toISOString().split('T')[0]

    // Find aircraft with registration expiring on target date
    const { data: aircraft, error } = await supabaseAdmin
      .from('aircraft')
      .select(`
        id,
        registration_number,
        registration_expiry,
        manufacturer,
        model,
        user_id,
        user_profiles!inner(email, full_name)
      `)
      .eq('status', 'active')
      .eq('registration_expiry', dateStr)

    if (error) {
      results.errors.push(`Registration query error: ${error.message}`)
      continue
    }

    for (const craft of aircraft || []) {
      try {
        // Check user notification preferences
        const { data: settings } = await supabaseAdmin
          .from('user_settings')
          .select('expiry_reminders, notification_email')
          .eq('user_id', craft.user_id)
          .single()

        if (settings?.expiry_reminders === false || settings?.notification_email === false) {
          continue
        }

        await sendRegistrationExpiryAlert({
          to: craft.user_profiles.email,
          name: craft.user_profiles.full_name,
          aircraft: {
            manufacturer: craft.manufacturer,
            model: craft.model,
            registration_number: craft.registration_number
          },
          daysUntilExpiry: days
        })

        results.registrationAlerts++

        // Log notification
        await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: craft.user_id,
            title: 'Registration Expiring',
            message: `${craft.manufacturer} ${craft.model} registration expires in ${days} days`,
            type: 'expiry',
            severity: days <= 7 ? 'error' : 'warning',
            data: { aircraft_id: craft.id, days_until_expiry: days }
          })

      } catch (err) {
        results.errors.push(`Failed to send alert for ${craft.registration_number}: ${err.message}`)
      }
    }
  }
}

async function checkPart107Expiries(results) {
  const today = new Date()

  for (const days of ALERT_THRESHOLDS.part107) {
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + days)
    const dateStr = targetDate.toISOString().split('T')[0]

    // Find users with Part 107 expiring on target date
    const { data: users, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, pilot_certificate_number, pilot_certificate_expiry')
      .eq('pilot_certificate_expiry', dateStr)

    if (error) {
      results.errors.push(`Part 107 query error: ${error.message}`)
      continue
    }

    for (const user of users || []) {
      try {
        // Check notification preferences
        const { data: settings } = await supabaseAdmin
          .from('user_settings')
          .select('expiry_reminders, notification_email')
          .eq('user_id', user.id)
          .single()

        if (settings?.expiry_reminders === false || settings?.notification_email === false) {
          continue
        }

        await sendPart107ExpiryAlert({
          to: user.email,
          name: user.full_name,
          certificateNumber: user.pilot_certificate_number,
          daysUntilExpiry: days
        })

        results.part107Alerts++

        // Log notification
        await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Part 107 Expiring',
            message: `Your Part 107 certificate expires in ${days} days`,
            type: 'expiry',
            severity: days <= 14 ? 'error' : 'warning',
            data: { days_until_expiry: days }
          })

      } catch (err) {
        results.errors.push(`Failed to send Part 107 alert for ${user.email}: ${err.message}`)
      }
    }
  }
}

async function sendWeeklySummaries(results) {
  // Get all users who want weekly summaries
  const { data: settings, error } = await supabaseAdmin
    .from('user_settings')
    .select(`
      user_id,
      weekly_summary,
      notification_email,
      user_profiles!inner(email, full_name)
    `)
    .eq('weekly_summary', true)
    .eq('notification_email', true)

  if (error) {
    results.errors.push(`Weekly summary query error: ${error.message}`)
    return
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  for (const setting of settings || []) {
    try {
      // Calculate user stats
      const userId = setting.user_id

      // Get flights this week
      const { data: flights } = await supabaseAdmin
        .from('flights')
        .select('id, duration_minutes, compliance_status')
        .eq('pilot_id', userId)
        .gte('start_time', weekAgo.toISOString())

      // Get compliance score
      const { data: allFlights } = await supabaseAdmin
        .from('flights')
        .select('compliance_status')
        .eq('pilot_id', userId)

      const totalFlights = allFlights?.length || 0
      const compliantFlights = allFlights?.filter(f => f.compliance_status === 'compliant').length || 0
      const complianceScore = totalFlights > 0
        ? Math.round((compliantFlights / totalFlights) * 100)
        : 100

      // Get upcoming expirations
      const upcomingExpirations = []
      const thirtyDaysOut = new Date()
      thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30)

      const { data: expiringAircraft } = await supabaseAdmin
        .from('aircraft')
        .select('registration_number, registration_expiry')
        .eq('user_id', userId)
        .lte('registration_expiry', thirtyDaysOut.toISOString().split('T')[0])
        .gte('registration_expiry', new Date().toISOString().split('T')[0])

      for (const craft of expiringAircraft || []) {
        const daysLeft = Math.ceil(
          (new Date(craft.registration_expiry) - new Date()) / (1000 * 60 * 60 * 24)
        )
        upcomingExpirations.push({
          item: `Registration ${craft.registration_number}`,
          daysLeft
        })
      }

      // Get unresolved violations
      const { data: violations } = await supabaseAdmin
        .from('compliance_checks')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'fail')

      const stats = {
        complianceScore,
        flightsThisWeek: flights?.length || 0,
        flightHours: Math.round((flights?.reduce((sum, f) => sum + (f.duration_minutes || 0), 0) || 0) / 60 * 10) / 10,
        upcomingExpirations,
        violations: violations?.length || 0
      }

      await sendWeeklySummary({
        to: setting.user_profiles.email,
        name: setting.user_profiles.full_name,
        stats
      })

      results.weeklySummaries++

    } catch (err) {
      results.errors.push(`Failed to send weekly summary to ${setting.user_profiles?.email}: ${err.message}`)
    }
  }
}
