import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {
  sendWelcomeEmail,
  sendRegistrationExpiryAlert,
  sendPart107ExpiryAlert,
  sendComplianceAlert,
  sendWeeklySummary
} from '@/lib/email'

const EMAIL_TYPES = {
  welcome: sendWelcomeEmail,
  registration_expiry: sendRegistrationExpiryAlert,
  part107_expiry: sendPart107ExpiryAlert,
  compliance_alert: sendComplianceAlert,
  weekly_summary: sendWeeklySummary
}

export async function POST(request) {
  try {
    const { type, ...data } = await request.json()

    if (!type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      )
    }

    const sendFunction = EMAIL_TYPES[type]
    if (!sendFunction) {
      return NextResponse.json(
        { error: `Unknown email type: ${type}` },
        { status: 400 }
      )
    }

    // Verify authentication for non-cron requests
    const authHeader = request.headers.get('authorization')
    const isCronRequest = authHeader === `Bearer ${process.env.CRON_SECRET}`

    if (!isCronRequest) {
      const supabase = createServerComponentClient({ cookies })
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Only allow sending to own email
      if (data.to !== user.email) {
        return NextResponse.json(
          { error: 'Can only send emails to your own address' },
          { status: 403 }
        )
      }
    }

    const result = await sendFunction(data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
