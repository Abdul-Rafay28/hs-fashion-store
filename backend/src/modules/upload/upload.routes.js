import { Router } from "express";
import multer from "multer";

import { adminOnly, protect } from "../../middlewares/auth.middleware.js";
import { ApiError } from "../../utils/apiError.js";
import { getUploadProviderStatus, uploadProductImages } from "./upload.controller.js";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new ApiError(400, "Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  },
});

router.get("/status", getUploadProviderStatus);
router.post("/", protect, adminOnly, upload.array("images", 8), uploadProductImages);

export default router;
