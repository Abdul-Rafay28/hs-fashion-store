import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Price cannot be negative."],
    },
    salePrice: {
      type: Number,
      default: null,
      min: [0, "Sale price cannot be negative."],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required."],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required."],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required."],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one image is required.",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      trim: true,
    },
    season: {
      type: String,
      required: [true, "Season is required."],
      trim: true,
    },
    fabricType: {
      type: String,
      required: [true, "Fabric type is required."],
      trim: true,
    },
    collection: {
      type: String,
      required: [true, "Collection is required."],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required."],
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stockStatus: {
      type: String,
      enum: ["in-stock", "limited", "made-to-order", "out-of-stock"],
      default: "in-stock",
    },
  },
  {
    suppressReservedKeysWarning: true,
    timestamps: true,
  },
);

productSchema.index({ title: "text", category: "text", season: "text", collection: "text" });
productSchema.index({ category: 1, season: 1, collection: 1, isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
