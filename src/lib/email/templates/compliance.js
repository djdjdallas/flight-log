import { baseTemplate } from './base'
import { EMAIL_CONFIG } from '../client'

/**
 * Registration expiry warning email
 * @param {Object} options
 * @param {string} options.name - User's name
 * @param {Object} options.aircraft - Aircraft details
 * @param {number} options.daysUntilExpiry - Days until expiration
 * @returns {Object} Email subject and HTML
 */
export function registrationExpiryEmail({ name, aircraft, daysUntilExpiry }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'
  const isUrgent = daysUntilExpiry <= 7

  const urgencyClass = isUrgent ? 'error-box' : 'warning-box'
  const urgencyText = isUrgent
    ? `⚠️ Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}!`
    : `Expires in ${daysUntilExpiry} days`

  const content = `
    <h1>FAA Registration Expiring Soon</h1>
    <p>Hi ${firstName},</p>
    <p>The FAA registration for your aircraft is expiring soon. Flying with an expired registration is a violation of Part 107 regulations.</p>

    <div class="${urgencyClass}">
      <p><strong>${aircraft.manufacturer} ${aircraft.model}</strong><br>
      Registration: ${aircraft.registration_number}<br>
      ${urgencyText}</p>
    </div>

    <h2 style="font-size: 18px; margin: 24px 0 16px;">How to renew:</h2>
    <ol style="margin: 0; padding-left: 20px; color: #52525b;">
      <li>Go to <a href="https://faadronezone.faa.gov" style="color: #0ea5e9;">FAA DroneZone</a></li>
      <li>Log in to your account</li>
      <li>Select your aircraft and renew registration</li>
      <li>Update the new expiry date in AeroNote</li>
    </ol>

    <p style="margin-top: 24px;">Once renewed, update your aircraft in AeroNote to keep your compliance status current.</p>
  `

  return {
    subject: isUrgent
      ? `🚨 URGENT: Registration expires in ${daysUntilExpiry} days — ${aircraft.registration_number}`
      : `Registration expiring in ${daysUntilExpiry} days — ${aircraft.registration_number}`,
    html: baseTemplate({
      title: 'Registration Expiring',
      preheader: `Your ${aircraft.manufacturer} ${aircraft.model} registration expires in ${daysUntilExpiry} days.`,
      content,
      ctaText: 'Update Aircraft Details',
      ctaUrl: `${baseUrl}/dashboard/aircraft`
    })
  }
}

/**
 * Part 107 certificate expiry warning email
 * @param {Object} options
 * @param {string} options.name - User's name
 * @param {string} options.certificateNumber - Certificate number
 * @param {number} options.daysUntilExpiry - Days until expiration
 * @returns {Object} Email subject and HTML
 */
export function part107ExpiryEmail({ name, certificateNumber, daysUntilExpiry }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'
  const isUrgent = daysUntilExpiry <= 30

  const urgencyClass = isUrgent ? 'error-box' : 'warning-box'

  const content = `
    <h1>Part 107 Certificate Expiring</h1>
    <p>Hi ${firstName},</p>
    <p>Your FAA Part 107 Remote Pilot Certificate is expiring soon. You must pass a recurrent knowledge test to maintain your certification.</p>

    <div class="${urgencyClass}">
      <p><strong>Certificate: ${certificateNumber || 'On file'}</strong><br>
      Expires in ${daysUntilExpiry} days</p>
    </div>

    <h2 style="font-size: 18px; margin: 24px 0 16px;">Renewal options:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #52525b;">
      <li><strong>Online:</strong> Complete the recurrent test at <a href="https://www.faa.gov/uas/commercial_operators/become_a_drone_pilot" style="color: #0ea5e9;">FAA TRUST</a> (free)</li>
      <li><strong>In-person:</strong> Schedule at an FAA-approved testing center</li>
    </ul>

    <div class="highlight-box" style="margin-top: 24px;">
      <p><strong>Remember:</strong> Your certificate expires 24 months from your last knowledge test. Plan ahead to avoid gaps in your certification!</p>
    </div>
  `

  return {
    subject: isUrgent
      ? `🚨 Part 107 certificate expires in ${daysUntilExpiry} days`
      : `Part 107 renewal reminder — ${daysUntilExpiry} days remaining`,
    html: baseTemplate({
      title: 'Part 107 Expiring',
      preheader: `Your Part 107 certificate expires in ${daysUntilExpiry} days. Time to schedule your recurrent test.`,
      content,
      ctaText: 'Update Certificate Info',
      ctaUrl: `${baseUrl}/dashboard/settings`
    })
  }
}

/**
 * Compliance violation alert email
 * @param {Object} options
 * @param {string} options.name - User's name
 * @param {Array} options.violations - List of violations
 * @param {Object} options.flight - Flight details
 * @returns {Object} Email subject and HTML
 */
export function complianceViolationEmail({ name, violations, flight }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'

  const violationsList = violations.map(v => `
    <li style="margin: 8px 0;">
      <strong>${v.type}:</strong> ${v.message}
    </li>
  `).join('')

  const content = `
    <h1>Compliance Issues Detected</h1>
    <p>Hi ${firstName},</p>
    <p>We've detected potential compliance issues with a recent flight. Please review and address these items:</p>

    <div class="error-box">
      <p><strong>Flight: ${flight.flight_number || 'Imported Flight'}</strong><br>
      Date: ${new Date(flight.start_time).toLocaleDateString()}</p>
    </div>

    <h2 style="font-size: 18px; margin: 24px 0 16px;">Issues found:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #52525b;">
      ${violationsList}
    </ul>

    <div class="highlight-box" style="margin-top: 24px;">
      <p><strong>Next steps:</strong> Review the flight details in your dashboard and update any missing information. If you believe this is an error, you can mark violations as resolved with an explanation.</p>
    </div>
  `

  return {
    subject: `⚠️ Compliance issues detected — Flight ${flight.flight_number || new Date(flight.start_time).toLocaleDateString()}`,
    html: baseTemplate({
      title: 'Compliance Alert',
      preheader: `${violations.length} compliance issue(s) found with your recent flight.`,
      content,
      ctaText: 'Review Flight Details',
      ctaUrl: `${baseUrl}/dashboard/flights`
    })
  }
}

/**
 * Weekly compliance summary email
 * @param {Object} options
 * @param {string} options.name - User's name
 * @param {Object} options.stats - Weekly statistics
 * @returns {Object} Email subject and HTML
 */
export function weeklySummaryEmail({ name, stats }) {
  const baseUrl = EMAIL_CONFIG.baseUrl
  const firstName = name?.split(' ')[0] || 'there'
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)

  const complianceColor = stats.complianceScore >= 90 ? '#10b981' :
    stats.complianceScore >= 70 ? '#f59e0b' : '#ef4444'

  const content = `
    <h1>Your Weekly Compliance Summary</h1>
    <p>Hi ${firstName},</p>
    <p>Here's your drone compliance overview for the past week:</p>

    <table style="width: 100%; margin: 24px 0; border-collapse: separate; border-spacing: 8px;">
      <tr>
        <td style="width: 33%; text-align: center; padding: 20px; background-color: #f4f4f5; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: 700; color: ${complianceColor};">${stats.complianceScore}%</div>
          <div style="font-size: 14px; color: #71717a; margin-top: 4px;">Compliance Score</div>
        </td>
        <td style="width: 33%; text-align: center; padding: 20px; background-color: #f4f4f5; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: 700; color: #0ea5e9;">${stats.flightsThisWeek}</div>
          <div style="font-size: 14px; color: #71717a; margin-top: 4px;">Flights</div>
        </td>
        <td style="width: 33%; text-align: center; padding: 20px; background-color: #f4f4f5; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: 700; color: #0ea5e9;">${stats.flightHours}</div>
          <div style="font-size: 14px; color: #71717a; margin-top: 4px;">Flight Hours</div>
        </td>
      </tr>
    </table>

    ${stats.upcomingExpirations?.length > 0 ? `
    <div class="warning-box">
      <p><strong>Upcoming expirations:</strong></p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #92400e;">
        ${stats.upcomingExpirations.map(exp => `<li>${exp.item}: ${exp.daysLeft} days</li>`).join('')}
      </ul>
    </div>
    ` : `
    <div class="highlight-box">
      <p><strong>All clear!</strong> No upcoming expirations in the next 30 days.</p>
    </div>
    `}

    ${stats.violations > 0 ? `
    <p style="margin-top: 24px;">You have <strong>${stats.violations} unresolved compliance issue${stats.violations > 1 ? 's' : ''}</strong>. Review and address these in your dashboard.</p>
    ` : ''}
  `

  return {
    subject: `Weekly Summary: ${stats.complianceScore}% compliance, ${stats.flightsThisWeek} flights`,
    html: baseTemplate({
      title: 'Weekly Summary',
      preheader: `Your compliance score is ${stats.complianceScore}%. ${stats.flightsThisWeek} flights logged this week.`,
      content,
      ctaText: 'View Full Dashboard',
      ctaUrl: `${baseUrl}/dashboard`
    })
  }
}
