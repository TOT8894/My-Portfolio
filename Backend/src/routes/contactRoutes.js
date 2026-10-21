import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
import { contactLimiter } from '../middlewares/securityMiddleware.js';

const router = Router();

// Public: Submit a contact message (Rate-limited against spam)
router.post('/', contactLimiter, contactController.submitMessage);

// Protected: Admin Inbox Management
router.get('/messages', verifyAccessToken, contactController.getMessages);
router.patch('/messages/:id/read', verifyAccessToken, contactController.markAsRead);
router.delete('/messages/:id', verifyAccessToken, contactController.deleteMessage);

// Protected: Direct Email Dispatcher (Send from Admin Dashboard to anyone or reply)
router.post('/send-email', verifyAccessToken, contactController.sendDirectEmail);

export default router;
