import { uploadService } from '../services/uploadService.js';

export const uploadController = {
  async handleUpload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file uploaded.' });
      }

      const result = await uploadService.uploadImage(req.file.buffer, req.file.originalname);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully.',
        url: result.url,
        public_id: result.public_id,
      });
    } catch (error) {
      next(error);
    }
  },

  async handleMultipleUpload(req, res, next) {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No image files uploaded.' });
      }

      const results = await uploadService.uploadMultiple(files);
      const urls = results.map((r) => r.url);

      return res.status(201).json({
        success: true,
        message: `${results.length} images uploaded successfully.`,
        urls,
        images: results,
      });
    } catch (error) {
      next(error);
    }
  },
};
