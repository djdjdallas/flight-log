import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/email'

// Use service role to verify user and send welcome email
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

export async function POST(request) {
  try {
    const { userId, email, name } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Verify the user exists in Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .auth
      .admin
      .getUserById(userId)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 401 }
      )
    }

    // Check if welcome email was already sent (avoid duplicates)
    const { data: existingNotification } = await supabaseAdmin
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'welcome')
      .single()

    if (existingNotification) {
      return NextResponse.json({ success: true, message: 'Welcome email already sent' })
    }

    // Send welcome email
    const result = await sendWelcomeEmail({
      to: email,
      name: name || email.split('@')[0]
    })

    if (!result.success && !result.skipped) {
      return NextResponse.json(
        { error: result.error || 'Failed to send welcome email' },
        { status: 500 }
      )
    }

    // Log welcome notification to prevent duplicates
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Welcome to AeroNote',
        message: 'Your account has been created. Get started by adding your first aircraft.',
        type: 'welcome',
        severity: 'info',
        read: true
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
