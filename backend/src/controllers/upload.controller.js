import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

class UploadController {
  /**
   * POST /api/v1/upload/image
   */
  static uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('No image file uploaded.');
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clearnest/images',
        resource_type: 'image',
      });

      ApiResponse.ok('Image uploaded successfully', {
        url: result.secure_url,
        publicId: result.public_id,
      }).send(res);
    } catch (err) {
      throw ApiError.internal('Cloudinary upload failed');
    }
  });

  /**
   * POST /api/v1/upload/document
   */
  static uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('No document file uploaded.');
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'clearnest/docs',
        resource_type: 'auto',
      });

      ApiResponse.ok('Document uploaded successfully', {
        url: result.secure_url,
        publicId: result.public_id,
      }).send(res);
    } catch (err) {
      throw ApiError.internal('Cloudinary upload failed');
    }
  });
}

export default UploadController;
