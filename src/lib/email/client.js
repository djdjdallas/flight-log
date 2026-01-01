import { Resend } from 'resend'

// Lazy-initialize Resend to avoid build-time errors
let _resend = null

function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Missing RESEND_API_KEY environment variable')
    }
    _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  }
  return _resend
}

// Default sender configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'AeroNote <notifications@aeronote.app>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@aeronote.app',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/**
 * Send an email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content
 * @returns {Promise<Object>} Send result
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    // Check for API key at runtime
    if (!process.env.RESEND_API_KEY) {
      console.warn('Skipping email send - RESEND_API_KEY not configured')
      return { success: true, data: { id: 'skipped' }, skipped: true }
    }

    const resend = getResend()
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      reply_to: EMAIL_CONFIG.replyTo
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
