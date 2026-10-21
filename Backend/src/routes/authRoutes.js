import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/securityMiddleware.js';

const router = Router();

router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', verifyAccessToken, authController.getMe);

export default router;
