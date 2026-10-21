import multer from 'multer';

// Use memory storage so file buffer can be streamed to Cloudinary or written locally
const storage = multer.memoryStorage();

const allowedMimes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const fileFilter = (req, file, cb) => {
  if (allowedMimes.has(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (PNG, JPG, WEBP, SVG) and documents (PDF, DOC) are permitted.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB safe limit
  },
  fileFilter,
});
