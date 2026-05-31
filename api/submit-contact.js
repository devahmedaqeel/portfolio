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
        <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; padding: 24px 12px; background-color: #030712; color: #f3f4f6; min-height: 100%;">
          <div style="max-width: 580px; margin: 0 auto; background: #0b0f19; border-radius: 20px; border: 1px solid rgba(0, 229, 196, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); overflow: hidden;">
            
            <!-- Sleek Glow Header -->
            <div style="padding: 40px 24px; background: linear-gradient(180deg, rgba(0, 229, 196, 0.1) 0%, rgba(11, 15, 25, 0) 100%); text-align: center; border-bottom: 1px solid rgba(255,255,255,0.03);">
              <div style="width: 54px; height: 54px; background: rgba(0, 229, 196, 0.1); border: 2.5px solid #00e5c4; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 0 20px rgba(0, 229, 196, 0.4);">
                <span style="font-size: 24px; line-height: 54px;">💼</span>
              </div>
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                Inquiry <span style="color: #00e5c4; text-shadow: 0 0 10px rgba(0, 229, 196, 0.25);">Received</span>
              </h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">ahmedaqeel.dev // lead router</p>
            </div>

            <!-- Content Area -->
            <div style="padding: 24px 16px;">
              
              <!-- Professional Box 1: Visitor details -->
              <div style="background: #111827; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04); border-left: 4px solid #00e5c4; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <h3 style="margin-top: 0; margin-bottom: 16px; color: #00e5c4; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center;">
                  <span style="margin-right: 8px;">👤</span> Visitor Information
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280; width: 110px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Full Name:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Email Link:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #00e5c4; text-decoration: none; font-weight: 600; border-bottom: 1px dashed rgba(0, 229, 196, 0.4);">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">WhatsApp:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${phone || 'Not provided'}</td>
                  </tr>
                </table>
              </div>

              <!-- Professional Box 2: Project Context -->
              <div style="background: #111827; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04); border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <h3 style="margin-top: 0; margin-bottom: 16px; color: #3b82f6; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  <span style="margin-right: 8px;">⚙️</span> Project Context
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280; width: 110px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Service:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 600; text-transform: capitalize;">${service || 'General / Other'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #6b7280; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Budget:</td>
                    <td style="padding: 6px 0; color: #eab308; font-weight: 700; font-size: 14px;">💰 ${budget || 'Not specified'}</td>
                  </tr>
                </table>
              </div>

              <!-- Professional Box 3: Detailed Message -->
              <div style="background: #111827; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04); border-left: 4px solid #a855f7; padding: 20px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <h3 style="margin-top: 0; margin-bottom: 14px; color: #a855f7; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  <span style="margin-right: 8px;">✉️</span> Message Details
                </h3>
                <div style="background: #0b0f19; border: 1px solid rgba(255,255,255,0.02); border-radius: 8px; padding: 14px; margin-top: 8px;">
                  <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Call to Action Card -->
              <div style="text-align: center; margin-bottom: 12px;">
                <a href="mailto:${email}" style="display: block; padding: 16px 24px; background: linear-gradient(135deg, #00e5c4 0%, #3b82f6 100%); color: #030712; text-decoration: none; font-size: 13px; font-weight: 800; border-radius: 30px; box-shadow: 0 6px 20px rgba(0, 229, 196, 0.3); text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease;">
                  📥 Quick Reply to Visitor
                </a>
              </div>

            </div>

            <!-- Footer Details -->
            <div style="padding: 24px; background: #060913; border-top: 1px solid rgba(255,255,255,0.02); text-align: center; font-size: 11px; color: #4b5563; letter-spacing: 0.5px;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-weight: 600;">PORTFOLIO GATEWAY LIVE REPORT</p>
              <p style="margin: 0;">Inquiry routed automatically via Edge Runtime at ${new Date().toLocaleString()}</p>
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
