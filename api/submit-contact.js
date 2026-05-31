const nodemailer = require('nodemailer');

// Helper function to escape HTML characters and prevent raw HTML/XSS injection
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Zero-dependency sliding window rate limiter
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const limitWindow = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter(timestamp => now - timestamp < limitWindow);
  requests.push(now);
  rateLimitMap.set(ip, requests);

  // Periodic cleanup to avoid memory leak
  for (const [key, value] of rateLimitMap.entries()) {
    const activeRequests = value.filter(timestamp => now - timestamp < limitWindow);
    if (activeRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, activeRequests);
    }
  }

  return requests.length > maxRequests;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         'unknown';
}

module.exports = async function handler(req, res) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, phone, service, budget, message, website } = req.body;

    // 1. Silent Bot Honeypot Interception
    if (website && website.trim() !== '') {
      // Return a fake success status to trick spambots into thinking their submit worked
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully'
      });
    }

    // 2. Client IP Rate Limiting
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please wait a few minutes and try again.'
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // 3. Strict Size Bounds Checks to prevent massive payload spamming
    if (name.length > 100) {
      return res.status(400).json({ success: false, message: 'Name is too long (maximum 100 characters)' });
    }
    if (email.length > 120) {
      return res.status(400).json({ success: false, message: 'Email is too long (maximum 120 characters)' });
    }
    if (phone && phone.length > 30) {
      return res.status(400).json({ success: false, message: 'Phone is too long (maximum 30 characters)' });
    }
    if (service && service.length > 50) {
      return res.status(400).json({ success: false, message: 'Service selection is invalid or too long' });
    }
    if (budget && budget.length > 100) {
      return res.status(400).json({ success: false, message: 'Budget field is too long (maximum 100 characters)' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ success: false, message: 'Message is too long (maximum 4000 characters)' });
    }

    // 4. Rigid Backend Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' });
    }

    // Sanitize user inputs to prevent any HTML/script injection
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeService = escapeHtml(service);
    const safeBudget = escapeHtml(budget);
    const formattedMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const dateTimeString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' (PKT)';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Ahmed Aqeel Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'engrahmedaqeel14@gmail.com',
      replyTo: email,
      subject: 'New Portfolio Contact Message - Ahmed Aqeel',
      
      // Beautiful Plain Text Fallback Version
      text: `💼 NEW CONTACT MESSAGE - AHMED AQEEL
==================================================
Source  : Portfolio Website
Date    : ${dateTimeString}
Branding: Portfolio Portal
--------------------------------------------------
👤 SENDER DETAILS:
* Name  : ${name}
* Email : ${email}
* Phone : ${phone || 'Not provided'}

💼 PROJECT CONTEXT:
* Service: ${service || 'General / Other'}
* Budget : ${budget || 'Not specified'}

✉️ VISITOR MESSAGE:
${message}
==================================================
Sent from Ahmed Aqeel Portfolio Website - © Ahmed Aqeel`,

      // Premium Dark Futuristic DevOrbitTech Email Template
      html: `
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; padding: 32px 12px; background-color: #070b16; color: #f3f4f6; min-height: 100%;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #0f172a; border-radius: 18px; border: 1px solid rgba(0, 245, 255, 0.25); box-shadow: 0 10px 30px rgba(0, 245, 255, 0.15); overflow: hidden; border-collapse: collapse;">
            
            <!-- Header Banner Section -->
            <tr>
              <td style="padding: 28px 28px 20px 28px; border-bottom: 2px solid rgba(0, 245, 255, 0.15); background-color: #0f172a;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="color: #00f5ff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Segoe UI', sans-serif;">
                      Ahmed Aqeel
                    </td>
                    <td align="right">
                      <span style="display: inline-block; padding: 4px 10px; background-color: rgba(0, 245, 255, 0.1); border: 1px solid rgba(0, 245, 255, 0.3); border-radius: 20px; font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px;">
                        <span style="display: inline-block; width: 6px; height: 6px; background-color: #00f5ff; border-radius: 50%; margin-right: 6px; vertical-align: middle;"></span>
                        Portfolio Form
                      </span>
                    </td>
                  </tr>
                </table>
                <h1 style="margin: 16px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">New Contact Message</h1>
                <p style="margin: 4px 0 0 0; font-size: 13.5px; color: #9ca3af; font-weight: 500;">A new client/contact submitted your portfolio form.</p>
              </td>
            </tr>

            <!-- Content Details Area -->
            <tr>
              <td style="padding: 28px 28px 12px 28px; background-color: #0f172a;">
                
                <!-- Info Cards Table (Professional Boxes) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                  
                  <!-- Row 1: Name & Email -->
                  <tr>
                    <td style="padding-bottom: 12px; width: 50%;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-right: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">👤 Sender Name</span>
                        <span style="font-size: 14px; font-weight: 600; color: #ffffff; display: block;">${safeName}</span>
                      </div>
                    </td>
                    <td style="padding-bottom: 12px; width: 50%;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-left: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">✉️ Email Address</span>
                        <a href="mailto:${safeEmail}" style="font-size: 14px; font-weight: 600; color: #00f5ff; text-decoration: none; display: block;">${safeEmail}</a>
                      </div>
                    </td>
                  </tr>

                  <!-- Row 2: Phone & Service -->
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-right: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">📞 Phone / WhatsApp</span>
                        <span style="font-size: 14px; font-weight: 600; color: #ffffff; display: block;">${safePhone || 'Not provided'}</span>
                      </div>
                    </td>
                    <td style="padding-bottom: 12px;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-left: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">⚙️ Requested Service</span>
                        <span style="font-size: 14px; font-weight: 600; color: #ffffff; display: block; text-transform: capitalize;">${safeService || 'General / Other'}</span>
                      </div>
                    </td>
                  </tr>

                  <!-- Row 3: Budget & Details -->
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-right: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">💰 Budget Range</span>
                        <span style="font-size: 14px; font-weight: 700; color: #eab308; display: block;">💰 ${safeBudget || 'Not specified'}</span>
                      </div>
                    </td>
                    <td style="padding-bottom: 12px;">
                      <div style="background-color: #1a2035; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); padding: 12px 16px; margin-left: 6px;">
                        <span style="font-size: 11px; font-weight: bold; color: #00f5ff; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">🗓️ Date &amp; Time</span>
                        <span style="font-size: 14px; font-weight: 600; color: #ffffff; display: block;">${dateTimeString}</span>
                      </div>
                    </td>
                  </tr>

                </table>

                <!-- Message Box Section -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td>
                      <h3 style="margin-top: 0; margin-bottom: 8px; color: #ffffff; font-size: 15px; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px;">Message</h3>
                      <div style="background-color: #0b1220; border-left: 4px solid #00f5ff; padding: 16px; border-radius: 12px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e5e7eb; white-space: pre-wrap; font-family: inherit;">${formattedMessage}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Reply Note Section -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px; background-color: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.15); border-radius: 8px;">
                  <tr>
                    <td style="padding: 12px; text-align: center; font-size: 12.5px; color: #00f5ff; font-weight: 600;">
                      💡 You can reply directly to this email to contact the sender.
                    </td>
                  </tr>
                </table>

                <!-- Reply CTA button box -->
                <div style="text-align: center; margin-bottom: 16px;">
                  <a href="mailto:${safeEmail}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00f5ff 0%, #3b82f6 100%); color: #070b16; text-decoration: none; font-size: 13px; font-weight: 800; border-radius: 30px; box-shadow: 0 4px 15px rgba(0, 245, 255, 0.35); text-transform: uppercase; letter-spacing: 1.5px; font-family: sans-serif;">
                    Reply to Sender
                  </a>
                </div>

              </td>
            </tr>

            <!-- Footer Section -->
            <tr>
              <td style="padding: 24px; background-color: #070b16; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.03);">
                <!-- Website/brand style footer line -->
                <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #00f5ff, #3b82f6); margin: 0 auto 16px auto; border-radius: 1px;"></div>
                <p style="margin: 0 0 6px 0; font-size: 11.5px; color: #9ca3af; font-weight: 500;">Sent from Ahmed Aqeel Portfolio Website</p>
                <p style="margin: 0; font-size: 11px; color: #4b5563; font-weight: 600; letter-spacing: 0.5px;">© Ahmed Aqeel</p>
              </td>
            </tr>

          </table>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};
