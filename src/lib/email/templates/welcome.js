import { baseTemplate } from './base'
import { EMAIL_CONFIG } from '../client'

/**
 * Welcome email for new users
 * @param {Object} options
 * @param {string} options.name - User's name
 * @returns {Object} Email subject and HTML
 */
export function welcomeEmail({ name }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'

  const content = `
    <h1>Welcome to AeroNote! 🚁</h1>
    <p>Hi ${firstName},</p>
    <p>Thanks for joining AeroNote — your new home for drone compliance management. We're excited to help you stay compliant and fly with confidence.</p>

    <div class="divider"></div>

    <h2 style="font-size: 18px; margin-bottom: 16px;">Get started in 3 easy steps:</h2>

    <p><strong>1. Add your aircraft</strong><br>
    Register your drones with their FAA registration numbers and Remote ID info.</p>

    <p><strong>2. Import your flight logs</strong><br>
    Upload logs from DJI, Autel, Skydio, or any GPS-enabled drone.</p>

    <p><strong>3. Generate compliance reports</strong><br>
    Create audit-ready documentation for FAA Part 107 compliance.</p>

    <div class="highlight-box">
      <p><strong>Pro tip:</strong> Use <a href="https://app.airdata.com" style="color: #0369a1;">Airdata.com</a> to sync and export your DJI flight logs as CSV files for easy import.</p>
    </div>
  `

  return {
    subject: 'Welcome to AeroNote — Let\'s get you compliant!',
    html: baseTemplate({
      title: 'Welcome to AeroNote',
      preheader: 'Your drone compliance journey starts now.',
      content,
      ctaText: 'Go to Dashboard',
      ctaUrl: `${baseUrl}/dashboard`
    })
  }
}

/**
 * Onboarding reminder email
 * @param {Object} options
 * @param {string} options.name - User's name
 * @param {number} options.daysInactive - Days since signup
 * @returns {Object} Email subject and HTML
 */
export function onboardingReminderEmail({ name, daysInactive }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'

  const content = `
    <h1>Let's finish setting up your account</h1>
    <p>Hi ${firstName},</p>
    <p>We noticed you haven't added any aircraft to your AeroNote account yet. Adding your first drone takes less than 2 minutes and unlocks the full power of compliance tracking.</p>

    <div class="highlight-box">
      <p><strong>What you're missing:</strong></p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #0369a1;">
        <li>Automatic compliance monitoring</li>
        <li>Registration expiry reminders</li>
        <li>Flight log import and analysis</li>
        <li>Audit-ready PDF reports</li>
      </ul>
    </div>

    <p>Have questions? Just reply to this email — we're here to help.</p>
  `

  return {
    subject: `${firstName}, your AeroNote account is waiting`,
    html: baseTemplate({
      title: 'Complete Your Setup',
      preheader: 'Add your first aircraft to unlock compliance tracking.',
      content,
      ctaText: 'Add Your First Aircraft',
      ctaUrl: `${baseUrl}/dashboard/aircraft`
    })
  }
}
