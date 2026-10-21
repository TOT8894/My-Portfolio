import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Protected: Single Image Upload to Cloudinary
router.post('/', verifyAccessToken, upload.single('image'), uploadController.handleUpload);

// Protected: Multiple Images Upload to Cloudinary (up to 20 images at once)
router.post('/multiple', verifyAccessToken, upload.array('images', 20), uploadController.handleMultipleUpload);

export default router;
