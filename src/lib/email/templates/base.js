import { EMAIL_CONFIG } from '../client'

/**
 * Base email template with AeroNote branding
 * @param {Object} options - Template options
 * @param {string} options.title - Email title
 * @param {string} options.preheader - Email preheader text
 * @param {string} options.content - Main HTML content
 * @param {string} [options.ctaText] - Call-to-action button text
 * @param {string} [options.ctaUrl] - Call-to-action button URL
 * @returns {string} Complete HTML email
 */
export function baseTemplate({ title, preheader, content, ctaText, ctaUrl }) {
  const baseUrl = EMAIL_CONFIG.baseUrl

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
      color: #18181b;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f4f5;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #0c1425;
      padding: 32px 40px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: #0ea5e9;
    }
    .content {
      padding: 40px;
    }
    .content h1 {
      margin: 0 0 16px;
      font-size: 24px;
      font-weight: 600;
      color: #18181b;
    }
    .content p {
      margin: 0 0 16px;
      font-size: 16px;
      line-height: 1.6;
      color: #52525b;
    }
    .content ul {
      margin: 0 0 16px;
      padding-left: 20px;
    }
    .content li {
      margin: 8px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #52525b;
    }
    .cta-button {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 28px;
      background-color: #0ea5e9;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      border-radius: 6px;
    }
    .cta-button:hover {
      background-color: #0284c7;
    }
    .divider {
      height: 1px;
      background-color: #e4e4e7;
      margin: 24px 0;
    }
    .footer {
      padding: 24px 40px;
      background-color: #fafafa;
      text-align: center;
    }
    .footer p {
      margin: 0 0 8px;
      font-size: 14px;
      color: #71717a;
    }
    .footer a {
      color: #0ea5e9;
      text-decoration: none;
    }
    .social-links {
      margin-top: 16px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #71717a;
      text-decoration: none;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    .highlight-box {
      background-color: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .highlight-box p {
      margin: 0;
      color: #0369a1;
    }
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .warning-box p {
      margin: 0;
      color: #92400e;
    }
    .error-box {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .error-box p {
      margin: 0;
      color: #991b1b;
    }
    .stats-grid {
      display: table;
      width: 100%;
      margin: 20px 0;
    }
    .stat-item {
      display: table-cell;
      width: 33.33%;
      text-align: center;
      padding: 16px;
      background-color: #f4f4f5;
      border-radius: 6px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0ea5e9;
    }
    .stat-label {
      font-size: 14px;
      color: #71717a;
      margin-top: 4px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px;
      }
      .header {
        padding: 24px;
      }
      .footer {
        padding: 20px 24px;
      }
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="${baseUrl}" class="logo">Aero<span>Note</span></a>
      </div>
      <div class="content">
        ${content}
        ${ctaText && ctaUrl ? `
        <div style="text-align: center;">
          <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
        </div>
        ` : ''}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} AeroNote. All rights reserved.</p>
        <p>
          <a href="${baseUrl}/dashboard">Dashboard</a> &bull;
          <a href="${baseUrl}/dashboard/settings">Settings</a> &bull;
          <a href="${baseUrl}/resources">Resources</a>
        </p>
        <p style="font-size: 12px; margin-top: 16px;">
          You're receiving this email because you have an AeroNote account.<br>
          <a href="${baseUrl}/dashboard/settings">Manage email preferences</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
