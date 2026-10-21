import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function createTransporterInstance() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  const isGmail = !process.env.SMTP_HOST || process.env.SMTP_HOST.includes('gmail');
  
  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

let transporter = createTransporterInstance();
if (transporter) {
  console.log('✅ Nodemailer Transport Initialized (Optimized).');
} else {
  console.log('ℹ️  Nodemailer SMTP credentials not configured. Running in simulator mode.');
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || `"Shanbel Dires Portfolio" <${process.env.SMTP_USER }>`;

  if (!transporter) {
    transporter = createTransporterInstance();
  }

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log('📧 Email sent successfully. MessageId:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.warn('⚠️ First email attempt failed, retrying once with fresh transporter:', error.message);
      try {
        transporter = createTransporterInstance();
        const info = await transporter.sendMail({
          from,
          to,
          subject,
          text,
          html,
        });
        console.log('📧 Email sent successfully on retry. MessageId:', info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (retryError) {
        console.error('❌ Failed to send email via SMTP after retry:', retryError.message);
        return { success: false, error: retryError.message };
      }
    }
  } else {
    console.log('--------------------------------------------------');
    console.log(`📨 [DEV EMAIL SIMULATOR]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('--------------------------------------------------');
    return { success: true, simulated: true };
  }
};
