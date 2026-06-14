import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createProduct,
  deleteProduct,
  getAdminStats,
  getFeaturedProducts,
  getNewArrivalProducts,
  getProductById,
  getProductDetails,
  getProducts,
  getSearchSuggestions,
  updateProduct,
} from "./product.service.js";

export const listProducts = asyncHandler(async (req, res) => {
  const data = await getProducts(req.query, {
    isAdmin: req.user?.role === "admin",
  });

  res.json({
    success: true,
    data,
  });
});

export const searchProducts = listProducts;

export const listFeaturedProducts = asyncHandler(async (req, res) => {
  const items = await getFeaturedProducts(Number(req.query.limit) || 4);

  res.json({
    success: true,
    data: items,
  });
});

export const listNewArrivalProducts = asyncHandler(async (req, res) => {
  const items = await getNewArrivalProducts(Number(req.query.limit) || 4);

  res.json({
    success: true,
    data: items,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const data = await getProductDetails(req.params.slug);

  res.json({
    success: true,
    data,
  });
});

export const getSingleProductById = asyncHandler(async (req, res) => {
  const data = await getProductById(req.params.id);

  res.json({
    success: true,
    data,
  });
});

export const createSingleProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

export const updateSingleProduct = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);

  res.json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});

export const deleteSingleProduct = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);

  res.json({
    success: true,
    message: "Product deleted successfully.",
  });
});

export const adminStats = asyncHandler(async (req, res) => {
  const data = await getAdminStats();

  res.json({
    success: true,
    data,
  });
});

export const searchSuggestions = asyncHandler(async (req, res) => {
  const data = await getSearchSuggestions(req.query.q || "");

  res.json({
    success: true,
    data,
  });
});

