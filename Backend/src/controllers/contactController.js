import { contactService } from '../services/contactService.js';

export const contactController = {
  async submitMessage(req, res, next) {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message body are required.',
        });
      }

      const result = await contactService.createMessage({
        name,
        email,
        phone,
        subject: subject || 'General Inquiry',
        message,
      });

      return res.status(201).json({
        success: true,
        message: 'Message delivered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req, res, next) {
    try {
      const messages = await contactService.getAllMessages();
      return res.json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const result = await contactService.markAsRead(req.params.id);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req, res, next) {
    try {
      await contactService.deleteMessage(req.params.id);
      return res.json({ success: true, message: 'Message removed.' });
    } catch (error) {
      next(error);
    }
  },

  async sendDirectEmail(req, res, next) {
    try {
      const {
        recipientEmail,
        recipientName,
        subject,
        message,
        messageId,
        companyName,
        serviceArea,
        businessHighlights,
        buttonText,
      } = req.body;
      if (!recipientEmail || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email, subject, and message are required.',
        });
      }

      const result = await contactService.sendDirectEmail({
        recipientEmail,
        recipientName,
        subject,
        message,
        messageId,
        companyName,
        serviceArea,
        businessHighlights,
        buttonText,
      });

      return res.status(200).json({
        success: true,
        message: `Email successfully delivered to ${recipientEmail}.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
