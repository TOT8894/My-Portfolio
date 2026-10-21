import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const uploadService = {
  async uploadImage(fileBuffer, originalname) {
    if (!isCloudinaryConfigured) {
      throw new Error(
        'Cloudinary service is not initialized. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shanbel-portfolio',
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary stream upload error:', error);
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  },

  async uploadMultiple(files) {
    if (!files || files.length === 0) return [];
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.buffer, file.originalname)
    );
    return Promise.all(uploadPromises);
  },
};
