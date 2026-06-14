import { Router } from "express";
import rateLimit from "express-rate-limit";

import { adminOnly, protect } from "../../middlewares/auth.middleware.js";
import { login, logout, me } from "./auth.controller.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again shortly.",
  },
});

router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, adminOnly, me);

export default router;
