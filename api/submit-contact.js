const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, phone, service, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

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
      subject: `💼 New Inquiry: ${service || 'General'} - from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #0b0f19; color: #f3f4f6; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; border: 1px solid rgba(0, 229, 196, 0.25); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); overflow: hidden;">
            
            <!-- Header Banner Box -->
            <div style="padding: 32px 24px; background: linear-gradient(135deg, #0e1e2d 0%, #061320 100%); border-bottom: 1px solid rgba(0, 229, 196, 0.15); text-align: center;">
              <span style="display: inline-block; padding: 6px 14px; background: rgba(0, 229, 196, 0.1); border: 1px solid #00e5c4; border-radius: 30px; font-size: 11px; font-weight: bold; color: #00e5c4; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                ⚡ New Portfolio Lead
              </span>
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Project Inquiry Received</h2>
            </div>

            <!-- Content Area -->
            <div style="padding: 24px;">
              
              <!-- Professional Box 1: Visitor Information -->
              <div style="background: #1f2937; border-radius: 12px; border: 1px solid #374151; padding: 18px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 14px; color: #00e5c4; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                  👤 Visitor Details
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #9ca3af; width: 100px; font-weight: 500;">Name:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #9ca3af; font-weight: 500;">Email:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #00e5c4; text-decoration: none; font-weight: 600;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #9ca3af; font-weight: 500;">WhatsApp/Tel:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>

              <!-- Professional Box 2: Service & Budget Context -->
              <div style="background: #1f2937; border-radius: 12px; border: 1px solid #374151; padding: 18px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 14px; color: #00e5c4; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                  💼 Project Context
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #9ca3af; width: 100px; font-weight: 500;">Service:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600; text-transform: capitalize;">${service || 'General / Other'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #9ca3af; font-weight: 500;">Budget:</td>
                    <td style="padding: 6px 0; color: #eab308; font-weight: 700;">${budget || 'Not specified'}</td>
                  </tr>
                </table>
              </div>

              <!-- Professional Box 3: Visitor Message -->
              <div style="background: #1f2937; border-radius: 12px; border: 1px solid #374151; padding: 18px; margin-bottom: 24px;">
                <h3 style="margin-top: 0; margin-bottom: 12px; color: #00e5c4; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                  ✉️ Message Details
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e5e7eb; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin-bottom: 8px;">
                <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background: #00e5c4; color: #0b0f19; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 229, 196, 0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                  Reply to Visitor
                </a>
              </div>

            </div>

            <!-- Footer Meta Box -->
            <div style="padding: 20px 24px; background: #111827; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0 0 6px 0;">Source: <strong style="color: #9ca3af;">ahmedaqeel.dev</strong></p>
              <p style="margin: 0;">Routed via Vercel Serverless Gateway at ${new Date().toLocaleString()}</p>
            </div>

          </div>
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
