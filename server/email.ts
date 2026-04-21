import nodemailer from 'nodemailer';
import { ENV } from './_core/env'; // Ensure this path is correct


// Create transporter using Gmail
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER ?? "khadka.sa9ar@gmail.com", // khadka.sa9ar@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD ?? "idcb lzaa jaxt tdhx", // App-specific password (NOT your Gmail password)
  },
});


// Email template for new signup
export async function sendWelcomeEmail(to: string, name: string) {
  const mailOptions = {
    from: '"Sa9ar\'s Travel Journey" <khadka.sa9ar@gmail.com>',
    to: to,
    subject: 'Welcome to My Travel Journey! 🌍',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Hello ${name}! 👋</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for signing up for my travel newsletter! I'm excited to share my adventures, 
          photography, and travel stories with you.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          You'll receive updates about:
        </p>
        <ul style="font-size: 16px; line-height: 1.6;">
          <li>New destinations I explore</li>
          <li>Travel tips and guides</li>
          <li>Exclusive photography from my journeys</li>
          <li>Behind-the-scenes stories</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.6;">
          Stay tuned for amazing content!
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br/>
          <strong>Sagar Khadka</strong>
        </p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          You received this email because you signed up at sa9ar.com
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error);
    throw error;
  }
}