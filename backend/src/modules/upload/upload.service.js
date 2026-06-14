import cloudinary, { isCloudinaryConfigured } from "../../config/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";

const uploadSingleFile = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "haseen-studio/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );

    stream.end(file.buffer);
  });

export const uploadImages = async (files) => {
  if (!isCloudinaryConfigured) {
    throw new ApiError(
      500,
      "Cloudinary credentials are missing. Configure Cloudinary before uploading images.",
    );
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new ApiError(400, "Please select at least one image to upload.");
  }

  return Promise.all(files.map((file) => uploadSingleFile(file)));
};

export const getUploadStatus = () => ({
  cloudinaryConfigured: isCloudinaryConfigured,
});
