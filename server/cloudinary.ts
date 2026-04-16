import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './_core/env'; // Ensure this path is correct

/**
 * Uploads an image file to Cloudinary.
 */
export async function uploadImageToCloudinary(imageBase64: string, folder: string): Promise<string> {
  // Configure Cloudinary INSIDE the function to ensure ENV is loaded
  cloudinary.config({
    cloud_name: ENV.cloudinaryCloudName,
    api_key: ENV.cloudinaryApiKey,
    api_secret: ENV.cloudinaryApiSecret,
    secure: true,
  });

  try {
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: `personal-website/${folder}`,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
}
