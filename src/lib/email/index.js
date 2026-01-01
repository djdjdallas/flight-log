/**
 * AeroNote Email Service
 *
 * Transactional email system using Resend.
 *
 * Usage:
 *   import { sendWelcomeEmail, sendComplianceAlert } from '@/lib/email'
 *   await sendWelcomeEmail({ to: 'user@example.com', name: 'John' })
 */

import { sendEmail, EMAIL_CONFIG } from './client'
import { welcomeEmail, onboardingReminderEmail } from './templates/welcome'
import {
  registrationExpiryEmail,
  part107ExpiryEmail,
  complianceViolationEmail,
  weeklySummaryEmail
} from './templates/compliance'

// Re-export config
export { EMAIL_CONFIG }

/**
 * Send welcome email to new user
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 */
export async function sendWelcomeEmail({ to, name }) {
  const { subject, html } = welcomeEmail({ name })
  return sendEmail({ to, subject, html })
}

/**
 * Send onboarding reminder email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 * @param {number} options.daysInactive - Days since signup
 */
export async function sendOnboardingReminder({ to, name, daysInactive }) {
  const { subject, html } = onboardingReminderEmail({ name, daysInactive })
  return sendEmail({ to, subject, html })
}

/**
 * Send registration expiry warning
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 * @param {Object} options.aircraft - Aircraft details
 * @param {number} options.daysUntilExpiry - Days until expiration
 */
export async function sendRegistrationExpiryAlert({ to, name, aircraft, daysUntilExpiry }) {
  const { subject, html } = registrationExpiryEmail({ name, aircraft, daysUntilExpiry })
  return sendEmail({ to, subject, html })
}

/**
 * Send Part 107 expiry warning
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 * @param {string} options.certificateNumber - Certificate number
 * @param {number} options.daysUntilExpiry - Days until expiration
 */
export async function sendPart107ExpiryAlert({ to, name, certificateNumber, daysUntilExpiry }) {
  const { subject, html } = part107ExpiryEmail({ name, certificateNumber, daysUntilExpiry })
  return sendEmail({ to, subject, html })
}

/**
 * Send compliance violation alert
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 * @param {Array} options.violations - List of violations
 * @param {Object} options.flight - Flight details
 */
export async function sendComplianceAlert({ to, name, violations, flight }) {
  const { subject, html } = complianceViolationEmail({ name, violations, flight })
  return sendEmail({ to, subject, html })
}

/**
 * Send weekly compliance summary
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User's name
 * @param {Object} options.stats - Weekly statistics
 */
export async function sendWeeklySummary({ to, name, stats }) {
  const { subject, html } = weeklySummaryEmail({ name, stats })
  return sendEmail({ to, subject, html })
}

/**
 * Send password reset email (uses Supabase built-in, this is for custom flow)
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.resetUrl - Password reset URL
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 500px; margin: 40px auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset your password</h1>
        <p>We received a request to reset your AeroNote password. Click the button below to create a new password:</p>
        <p><a href="${resetUrl}" class="button">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link expires in 1 hour.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: 'Reset your AeroNote password',
    html
  })
}

// Export template functions for testing/preview
export {
  welcomeEmail,
  onboardingReminderEmail,
  registrationExpiryEmail,
  part107ExpiryEmail,
  complianceViolationEmail,
  weeklySummaryEmail
}
