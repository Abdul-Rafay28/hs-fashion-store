import Product from "./product.model.js";
import { ApiError } from "../../utils/apiError.js";
import { slugify } from "../../utils/slugify.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const parseBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return fallback;
};

const parseNullableNumber = (value) => {
  if (value === "" || value === null || typeof value === "undefined") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images.map((image) => normalizeText(image)).filter(Boolean);
  }

  if (typeof images === "string" && images.trim()) {
    return [images.trim()];
  }

  return [];
};

const buildUniqueSlug = async (title, currentProductId = null) => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new ApiError(400, "A valid product title is required.");
  }

  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existingProduct = await Product.findOne({ slug: candidateSlug }).select("_id");

    if (!existingProduct || existingProduct._id.toString() === currentProductId?.toString()) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const validateProductPayload = (payload, existingProduct = null) => {
  const mergedPayload = {
    title: normalizeText(payload.title) || existingProduct?.title || "",
    shortDescription: normalizeText(payload.shortDescription) || existingProduct?.shortDescription || "",
    fullDescription: normalizeText(payload.fullDescription) || existingProduct?.fullDescription || "",
    category: normalizeText(payload.category) || existingProduct?.category || "",
    season: normalizeText(payload.season) || existingProduct?.season || "",
    fabricType: normalizeText(payload.fabricType) || existingProduct?.fabricType || "",
    collection: normalizeText(payload.collection) || existingProduct?.collection || "",
    section: normalizeText(payload.section) || existingProduct?.section || "",
    stockStatus: normalizeText(payload.stockStatus) || existingProduct?.stockStatus || "in-stock",
    images:
      normalizeImages(payload.images).length > 0
        ? normalizeImages(payload.images)
        : existingProduct?.images || [],
    price:
      typeof payload.price === "undefined" ? existingProduct?.price : Number(payload.price),
    salePrice:
      typeof payload.salePrice === "undefined"
        ? existingProduct?.salePrice ?? null
        : parseNullableNumber(payload.salePrice),
    isFeatured:
      typeof payload.isFeatured === "undefined"
        ? existingProduct?.isFeatured ?? false
        : parseBoolean(payload.isFeatured),
    isNewArrival:
      typeof payload.isNewArrival === "undefined"
        ? existingProduct?.isNewArrival ?? true
        : parseBoolean(payload.isNewArrival),
    isActive:
      typeof payload.isActive === "undefined"
        ? existingProduct?.isActive ?? true
        : parseBoolean(payload.isActive),
  };

  const requiredFields = [
    "title",
    "shortDescription",
    "fullDescription",
    "category",
    "season",
    "fabricType",
    "collection",
    "section",
  ];

  const missingField = requiredFields.find((field) => !mergedPayload[field]);

  if (missingField) {
    throw new ApiError(400, `${missingField} is required.`);
  }

  if (!Array.isArray(mergedPayload.images) || mergedPayload.images.length === 0) {
    throw new ApiError(400, "At least one product image is required.");
  }

  if (Number.isNaN(Number(mergedPayload.price)) || Number(mergedPayload.price) <= 0) {
    throw new ApiError(400, "Price must be greater than zero.");
  }

  if (
    mergedPayload.salePrice !== null &&
    (Number.isNaN(Number(mergedPayload.salePrice)) || Number(mergedPayload.salePrice) <= 0)
  ) {
    throw new ApiError(400, "Sale price must be greater than zero when provided.");
  }

  if (
    mergedPayload.salePrice !== null &&
    Number(mergedPayload.salePrice) >= Number(mergedPayload.price)
  ) {
    throw new ApiError(400, "Sale price must be lower than the regular price.");
  }

  return {
    ...mergedPayload,
    price: Number(mergedPayload.price),
    salePrice:
      mergedPayload.salePrice === null ? null : Number(mergedPayload.salePrice),
  };
};

const buildFilters = (query, isAdmin = false) => {
  const filters = {};

  if (!(isAdmin && parseBoolean(query.includeInactive))) {
    filters.isActive = true;
  }

  if (query.category) {
    filters.category = new RegExp(`^${escapeRegex(query.category)}$`, "i");
  }

  if (query.season) {
    filters.season = new RegExp(`^${escapeRegex(query.season)}$`, "i");
  }

  if (query.collection) {
    filters.collection = new RegExp(`^${escapeRegex(query.collection)}$`, "i");
  }

  if (query.section) {
    filters.section = new RegExp(`^${escapeRegex(query.section)}$`, "i");
  }

  if (typeof query.stockStatus !== "undefined" && query.stockStatus !== "") {
    filters.stockStatus = query.stockStatus;
  }

  if (typeof query.isFeatured !== "undefined") {
    filters.isFeatured = parseBoolean(query.isFeatured);
  }

  if (typeof query.isNewArrival !== "undefined") {
    filters.isNewArrival = parseBoolean(query.isNewArrival);
  }

  const searchQuery = normalizeText(query.search || query.q || "");

  if (searchQuery) {
    const safeRegex = new RegExp(escapeRegex(searchQuery), "i");
    filters.$or = [
      { title: safeRegex },
      { category: safeRegex },
      { season: safeRegex },
      { collection: safeRegex },
    ];
  }

  return filters;
};

const getSortQuery = (sort) => {
  switch (sort) {
    case "price-asc":
      return { price: 1, createdAt: -1 };
    case "price-desc":
      return { price: -1, createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "featured":
      return { isFeatured: -1, createdAt: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
};

export const getProducts = async (query, { isAdmin = false } = {}) => {
  const filters = buildFilters(query, isAdmin);
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 48);
  const skip = (page - 1) * limit;
  const sort = getSortQuery(query.sort);

  const [items, total] = await Promise.all([
    Product.find(filters).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filters),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
};

export const getFeaturedProducts = async (limit = 4) =>
  Product.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

export const getNewArrivalProducts = async (limit = 4) =>
  Product.find({ isActive: true, isNewArrival: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

export const getProductDetails = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).lean();

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [{ category: product.category }, { collection: product.collection }],
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return {
    ...product,
    relatedProducts,
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).lean();

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return product;
};

export const createProduct = async (payload) => {
  const validatedPayload = validateProductPayload(payload);
  const slug = await buildUniqueSlug(validatedPayload.title);

  const product = await Product.create({
    ...validatedPayload,
    slug,
  });

  return product;
};

export const updateProduct = async (id, payload) => {
  const existingProduct = await Product.findById(id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found.");
  }

  const validatedPayload = validateProductPayload(payload, existingProduct);
  const titleChanged = validatedPayload.title !== existingProduct.title;

  existingProduct.title = validatedPayload.title;
  existingProduct.slug = titleChanged
    ? await buildUniqueSlug(validatedPayload.title, existingProduct._id)
    : existingProduct.slug;
  existingProduct.price = validatedPayload.price;
  existingProduct.salePrice = validatedPayload.salePrice;
  existingProduct.shortDescription = validatedPayload.shortDescription;
  existingProduct.fullDescription = validatedPayload.fullDescription;
  existingProduct.images = validatedPayload.images;
  existingProduct.category = validatedPayload.category;
  existingProduct.season = validatedPayload.season;
  existingProduct.fabricType = validatedPayload.fabricType;
  existingProduct.collection = validatedPayload.collection;
  existingProduct.section = validatedPayload.section;
  existingProduct.isFeatured = validatedPayload.isFeatured;
  existingProduct.isNewArrival = validatedPayload.isNewArrival;
  existingProduct.isActive = validatedPayload.isActive;
  existingProduct.stockStatus = validatedPayload.stockStatus;

  await existingProduct.save();

  return existingProduct;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await product.deleteOne();
  return product;
};

export const getAdminStats = async () => {
  const [totalProducts, featuredProducts, newArrivals, activeProducts] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ isNewArrival: true }),
      Product.countDocuments({ isActive: true }),
    ]);

  return {
    totalProducts,
    featuredProducts,
    newArrivals,
    activeProducts,
  };
};

export const getSearchSuggestions = async (query) => {
  const searchQuery = normalizeText(query);

  if (searchQuery.length < 2) {
    return [];
  }

  const safeRegex = new RegExp(escapeRegex(searchQuery), "i");

  const suggestions = await Product.find({
    isActive: true,
    $or: [
      { title: safeRegex },
      { category: safeRegex },
      { season: safeRegex },
      { collection: safeRegex },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .select("title slug category season collection images price salePrice")
    .lean();

  return suggestions;
};

