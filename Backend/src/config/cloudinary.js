import './env.js';
import { v2 as cloudinary } from 'cloudinary';

let isCloudinaryConfigured = false;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary Configured Successfully.');
} else {
  console.error('❌ Cloudinary credentials missing in .env! All media uploads require Cloudinary.');
}

export { cloudinary, isCloudinaryConfigured };
