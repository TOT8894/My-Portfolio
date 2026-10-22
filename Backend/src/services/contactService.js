import prisma from '../config/prisma.js';
import { sendEmail } from '../config/mailer.js';

export const contactService = {
  async createMessage(data) {
    const { name, email, phone, subject, message } = data;
    const phoneClean = (phone || '').trim();
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name || 'Anonymous Visitor',
        email: email || 'no-reply@example.com',
        phone: phoneClean,
        subject: subject || 'General Inquiry',
        message: message || '',
      },
    });

    // 2. Query dynamic profile for notifications & receipts
    let dbProfile = null;
    try {
      dbProfile = await prisma.profile.findFirst();
    } catch (_) {}
    const adminName = (dbProfile?.name || 'Shanbel Dires').trim();
    const adminRole = (dbProfile?.role || 'Full-Stack Software Engineer & Network Architect').trim();
    const adminLocation = (dbProfile?.location || 'Addis Ababa, Ethiopia').trim();
    const adminEmail = (dbProfile?.email || process.env.SMTP_USER || '').trim();
    const adminPhone = (dbProfile?.phone || '').trim();

    // Send Real Email Alert to Owner
    const destinationEmail = process.env.EMAIL_TO || process.env.SMTP_USER || adminEmail;
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const alertEmailResult = await sendEmail({
      to: destinationEmail,
      subject: `🚨 [New Portfolio Message] ${subject || 'Inquiry'} - From ${name}`,
      text: `New contact submission received with full details:\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Phone Number: ${phoneClean || 'Not provided'}\n` +
        `• Subject: ${subject}\n` +
        `• Received At: ${formattedDate}\n\n` +
        `Message Content:\n${message}\n\n` +
        `Directly view and reply in your Admin Dashboard: https://shanbeldires.pro.et/admin/dashboard`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #1e293b;">
          
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 9999px;">
              New Direct Transmission
            </span>
            <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 12px 0 4px 0;">
              ${subject || 'New Portfolio Inquiry'}
            </h1>
            <p style="font-size: 13px; color: #64748b; margin: 0;">
              Delivered on ${formattedDate}
            </p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Sender Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email Address:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #059669; font-weight: 700; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
                <td style="padding: 6px 0;">
                  ${phoneClean ? `<a href="tel:${phoneClean}" style="color: #059669; font-weight: 700; text-decoration: none;">${phoneClean}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 28px;">
            <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; margin-bottom: 10px;">
              Message Content:
            </h3>
            <div style="background: #ffffff; border-left: 4px solid #10b981; padding: 16px 20px; background-color: #f0fdf4; border-radius: 0 12px 12px 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">
              ${message}
            </div>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || `Your inquiry to ${adminName}`)}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 700; border-radius: 12px; text-decoration: none; margin-right: 8px;">
              Reply via Email Directly
            </a>
            ${phoneClean ? `
              <a href="tel:${phoneClean}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 700; border-radius: 12px; text-decoration: none;">
                Call / WhatsApp
              </a>
            ` : ''}
          </div>

        </div>
      `,
    });

    // If dispatch failed, do not claim success - require retry
    if (!alertEmailResult.success) {
      console.error(`❌ Failed to dispatch email notification to ${adminName}:`, alertEmailResult.error);
      const emailError = new Error(
        `Could not deliver message to ${adminName} email at this moment. Please check your network and click Send Again.`
      );
      emailError.statusCode = 502;
      emailError.emailSent = false;
      throw emailError;
    }

    // 3. Send Professional Confirmation Receipt to Visitor
    if (email && email.includes('@')) {
      await sendEmail({
        to: email,
        subject: `Thank you for contacting ${adminName}!`,
        text: `Hi ${name},\n\nThank you for reaching out through my portfolio. I have received your message regarding "${subject}" along with your contact details.\n\nI will review your message and respond within 24 hours.\n\nBest regards,\n${adminName}\n${adminRole}\n${adminLocation}\nPhone: ${adminPhone}\nEmail: ${adminEmail}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background: #ecfdf5; color: #059669; font-size: 20px; font-weight: bold;">
                ✓
              </div>
              <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 4px 0;">
                Inquiry Received
              </h2>
              <p style="font-size: 13px; color: #64748b; margin: 0;">
                Thank you for connecting with ${adminName}
              </p>
            </div>

            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              Hi <strong>${name}</strong>,
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">
              Your message regarding <em>"${subject}"</em> has been received into my dashboard stream. I personally review every inquiry and will respond within 24 hours.
            </p>

            <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 13px; color: #475569;">
              <strong>Summary of your submission:</strong><br />
              • Subject: ${subject}<br />
              • Phone: ${phoneClean || 'N/A'}<br />
              • Date: ${formattedDate}
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            
            <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
              <strong>${adminName}</strong><br />
              ${adminRole}<br />
              ${adminLocation}<br />
              Email: ${adminEmail} | Phone: ${adminPhone}
            </p>
          </div>
        `,
      });
    }

    return savedMessage;
  },

  async getAllMessages() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAsRead(id) {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  },

  async deleteMessage(id) {
    await prisma.contactMessage.delete({ where: { id } });
    return { success: true };
  },

  // Direct Email Dispatcher: Sends glowing modern emails directly from Admin Dashboard
  async sendDirectEmail({
    recipientEmail,
    recipientName,
    subject,
    message,
    messageId,
    companyName,
    serviceArea,
    businessHighlights,
    buttonText,
  }) {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      const err = new Error('A valid recipient email address is required.');
      err.statusCode = 400;
      throw err;
    }
    if (!subject || !subject.trim()) {
      const err = new Error('Email subject is required.');
      err.statusCode = 400;
      throw err;
    }
    if (!message || !message.trim()) {
      const err = new Error('Email message body is required.');
      err.statusCode = 400;
      throw err;
    }

    // Dynamic database-driven profile
    let dbProfile = null;
    try {
      dbProfile = await prisma.profile.findFirst();
    } catch (_) {}
    const authorName = (dbProfile?.name || 'Shanbel Dires').trim();
    const authorRole = (dbProfile?.role || 'Full-Stack Software Engineer & Network Architect').trim();
    const authorLocation = (dbProfile?.location || 'Addis Ababa, Ethiopia').trim();
    const authorInstitution = (dbProfile?.institution || '').trim();
    const authorEmail = (dbProfile?.email || process.env.SMTP_USER || 'shanbeldires8@gmail.com').trim();
    const authorPhone = (dbProfile?.phone || '+251 991 185 321').trim();

    const frontendUrl = process.env.FRONTEND_URL || 'https://shanbeldires.pro.et';
    const contactUrl = `${frontendUrl}/#contact`;
    const cleanName = (recipientName || '').trim();
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Check if message already begins with greeting to avoid duplicate greetings
    const cleanMsg = (message || '').trim();
    const startsWithGreeting = /^(hi|hello|dear|hey|good\s+(morning|afternoon|evening))\b/i.test(cleanMsg);
    const greetingHtml = (!startsWithGreeting && cleanName)
      ? `<p style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Hi ${cleanName},</p>`
      : '';

    // Business / Enterprise Section: strictly check if null/empty
    const cleanCompany = (companyName || '').trim();
    const cleanService = (serviceArea || '').trim();
    const cleanHighlights = (businessHighlights || '').trim();
    const hasBusinessDetails = Boolean(cleanCompany || cleanService || cleanHighlights);

    let businessSectionHtml = '';
    if (hasBusinessDetails) {
      const businessRows = [];
      if (cleanCompany) {
        businessRows.push(`
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b; width: 140px; font-size: 13px;">Organization / Client:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-size: 13px;">${cleanCompany}</td>
          </tr>
        `);
      }
      if (cleanService) {
        businessRows.push(`
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px;">Focus / Service Area:</td>
            <td style="padding: 6px 0; color: #059669; font-weight: 700; font-size: 13px;">${cleanService}</td>
          </tr>
        `);
      }
      if (cleanHighlights) {
        businessRows.push(`
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px; vertical-align: top;">Key Scope / Value:</td>
            <td style="padding: 6px 0; color: #1e293b; line-height: 1.5; font-size: 13px; white-space: pre-wrap;">${cleanHighlights}</td>
          </tr>
        `);
      }

      businessSectionHtml = `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #059669; border-radius: 14px; padding: 18px 20px; margin: 0 0 24px 0;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #059669; margin-bottom: 8px;">
            Enterprise Context & Scope
          </div>
          <table role="presentation" width="100%" style="border-collapse: collapse;">
            ${businessRows.join('')}
          </table>
        </div>
      `;
    }

    // Human-made button (not AI sparkles)
    const cleanButtonText = (buttonText || '').trim() || 'View Portfolio & Work';

    const glowingHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 36px 16px;">
    <tr>
      <td align="center">
        
        <!-- Elegant Light Mode Card with Subtle Emerald Aura Border -->
        <table role="presentation" width="100%" style="max-width: 600px; border-collapse: separate; background: linear-gradient(135deg, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.2) 50%, rgba(16, 185, 129, 0.4) 100%); border-radius: 26px; padding: 1.5px; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.15);">
          <tr>
            <td style="background-color: #ffffff; border-radius: 25px; padding: 36px 32px;">
              
              <!-- Sender Brand Badge in Light Mode -->
              <table role="presentation" width="100%" style="margin-bottom: 22px;">
                <tr>
                  <td>
                    <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; padding: 5px 14px; margin-bottom: 14px;">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: #059669;">
                        Direct Message from ${authorName}
                      </span>
                    </div>
                    
                    <h1 style="margin: 0 0 4px 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                      ${authorName}
                    </h1>
                    <p style="margin: 0; font-size: 13px; font-weight: 700; color: #059669;">
                      ${authorRole}
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
                      ${authorLocation}${authorInstitution ? ` • ${authorInstitution}` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Crisp Emerald Divider -->
              <div style="height: 2px; width: 100%; background: linear-gradient(90deg, #10b981 0%, rgba(16, 185, 129, 0.2) 75%, transparent 100%); margin: 18px 0 24px 0; border-radius: 9999px;"></div>

              <!-- Non-duplicated Greeting -->
              ${greetingHtml}

              <!-- Optional Business / Enterprise Section (Strictly Omitted if Empty) -->
              ${businessSectionHtml}

              <!-- Message Body in Crisp White Day Mode Glass Panel -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 14px; padding: 22px 24px; margin: 0 0 28px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
                <div style="font-size: 15px; line-height: 1.75; color: #1e293b; white-space: pre-wrap; word-break: break-word;">
${cleanMsg}
                </div>
              </div>

              <!-- Human-Made Call-to-Action Button -->
              <div style="text-align: center; margin: 28px 0 24px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td align="center" style="border-radius: 12px; background-color: #059669; box-shadow: 0 4px 16px rgba(5, 150, 105, 0.25);">
                      <a href="${contactUrl}" target="_blank" style="display: inline-block; padding: 14px 34px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.2px;">
                        ${cleanButtonText}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">
                  Feel free to reply directly to this email or visit my portfolio.
                </p>
              </div>

              <!-- Direct Contact Details from Database Profile -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 22px;">
                <table role="presentation" width="100%" style="font-size: 13px; color: #334155; border-collapse: collapse;">
                  ${authorPhone ? `
                    <tr>
                      <td style="padding: 5px 0; font-weight: 600; color: #64748b; width: 120px;">Direct Phone:</td>
                      <td style="padding: 5px 0;">
                        <a href="tel:${authorPhone}" style="color: #059669; font-weight: 700; text-decoration: none;">${authorPhone}</a>
                      </td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 5px 0; font-weight: 600; color: #64748b; width: 120px;">Direct Email:</td>
                    <td style="padding: 5px 0;">
                      <a href="mailto:${authorEmail}" style="color: #059669; font-weight: 700; text-decoration: none;">${authorEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: 600; color: #64748b;">Location:</td>
                    <td style="padding: 5px 0; color: #0f172a; font-weight: 600;">
                      ${authorLocation}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: 600; color: #64748b;">Sent:</td>
                    <td style="padding: 5px 0; color: #64748b; font-size: 12px;">
                      ${formattedDate}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Footer & Links in Day Mode -->
              <table role="presentation" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 18px; text-align: center;">
                <tr>
                  <td>
                    <div style="margin-bottom: 10px;">
                      <a href="${frontendUrl}" style="color: #059669; font-size: 12px; font-weight: 700; text-decoration: none; margin: 0 10px;">Portfolio Home</a>
                      <span style="color: #cbd5e1;">•</span>
                      <a href="${contactUrl}" style="color: #059669; font-size: 12px; font-weight: 700; text-decoration: none; margin: 0 10px;">Contact Me</a>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      © ${new Date().getFullYear()} ${authorName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    const plainText = `${cleanName ? `Hi ${cleanName},\n\n` : ''}${cleanMsg}\n\n` +
      (hasBusinessDetails ? `Enterprise Scope:\n${cleanCompany ? `• Organization: ${cleanCompany}\n` : ''}${cleanService ? `• Service: ${cleanService}\n` : ''}${cleanHighlights ? `• Scope: ${cleanHighlights}\n` : ''}\n` : '') +
      `---\n${authorName}\n${authorRole}\n${authorPhone ? `Phone: ${authorPhone}\n` : ''}Email: ${authorEmail}\nPortfolio: ${contactUrl}`;

    // Send email using Nodemailer
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject,
      html: glowingHtml,
      text: plainText,
    });
    // If this was a reply to an existing contact message, mark it as read and record reply metadata
    if (messageId) {
      await prisma.contactMessage.update({
        where: { id: messageId },
        data: { isRead: true },
      });
    }

    return {
      success: true,
      delivered: emailResult.success !== false,
      messageId: emailResult.messageId || 'dispatched',
      warning: emailResult.error || null,
      recipientEmail,
      subject,
    };
  },
};
