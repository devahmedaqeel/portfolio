const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, email, phone, service, message } = req.body;

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
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'engrahmedaqeel14@gmail.com',
      replyTo: email,
      subject: 'New Portfolio Contact Message - Ahmed Aqeel',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f7fb;">
          <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-bottom: 16px;">New Portfolio Contact Message</h2>
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Service:</strong> ${service || 'Not selected'}</p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p><strong>Message:</strong></p>
            <p style="background: #f9fafb; padding: 14px; border-radius: 8px; color: #374151;">
              ${message}
            </p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="font-size: 13px; color: #6b7280;">
              Source: Portfolio Website<br/>
              Date: ${new Date().toLocaleString()}
            </p>
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
