import { asyncHandler } from "../../utils/asyncHandler.js";
import { getUploadStatus, uploadImages } from "./upload.service.js";

export const getUploadProviderStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: getUploadStatus(),
  });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  const data = await uploadImages(req.files);

  res.status(201).json({
    success: true,
    message: "Images uploaded successfully.",
    data,
  });
});
