import { Router } from "express";

import { adminOnly, protect } from "../../middlewares/auth.middleware.js";
import {
  adminStats,
  createSingleProduct,
  deleteSingleProduct,
  getProduct,
  getSingleProductById,
  listFeaturedProducts,
  listNewArrivalProducts,
  listProducts,
  searchProducts,
  searchSuggestions,
  updateSingleProduct,
} from "./product.controller.js";

const router = Router();

router.get("/", listProducts);
router.get("/search", searchProducts);
router.get("/suggestions", searchSuggestions);
router.get("/featured", listFeaturedProducts);
router.get("/new-arrivals", listNewArrivalProducts);
router.get("/admin/stats", protect, adminOnly, adminStats);
router.get("/id/:id", protect, adminOnly, getSingleProductById);
router.get("/:slug", getProduct);
router.post("/", protect, adminOnly, createSingleProduct);
router.put("/:id", protect, adminOnly, updateSingleProduct);
router.delete("/:id", protect, adminOnly, deleteSingleProduct);

export default router;

