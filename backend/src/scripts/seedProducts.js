import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import Product from "../modules/product/product.model.js";
import { slugify } from "../utils/slugify.js";

const demoProducts = [
  {
    title: "Noor Luxe Embroidered Frock",
    price: 14500,
    salePrice: 12900,
    shortDescription:
      "Soft blush formal frock with layered net volume and delicate in-house embroidery.",
    fullDescription:
      "Designed for festive dinners and family celebrations, this couture-inspired girls frock blends airy net layers with precise embroidery placement and premium finishing from our in-house atelier.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Luxury Frocks",
    season: "Festive",
    fabricType: "Organza",
    collection: "Noor Collection",
    section: "Featured Collection",
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    stockStatus: "in-stock",
  },
  {
    title: "Meher Festive Pearl Dress",
    price: 16800,
    salePrice: null,
    shortDescription:
      "Elegant pearl-toned party dress made for wedding season and portrait moments.",
    fullDescription:
      "This piece carries luminous threadwork, a structured bodice, and graceful flare that photographs beautifully. It is finished in-house for a smoother silhouette and boutique-grade polish.",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Party Wear",
    season: "Wedding",
    fabricType: "Chiffon",
    collection: "Meher Festive",
    section: "New Arrivals",
    isFeatured: true,
    isNewArrival: true,
    isActive: true,
    stockStatus: "limited",
  },
  {
    title: "Zaria Mini Bridal Ensemble",
    price: 22500,
    salePrice: 19900,
    shortDescription:
      "Mini bridal look with rich embroidery placement, volume, and heirloom-inspired detail.",
    fullDescription:
      "Crafted for statement celebrations, this mini bridal ensemble is cut from premium fabric and elevated with embroidery developed on our in-house machines for balance, symmetry, and finish.",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Mini Bridal",
    season: "Wedding",
    fabricType: "Raw Silk",
    collection: "Zaria Couture",
    section: "Featured Collection",
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    stockStatus: "made-to-order",
  },
  {
    title: "Gulzar Summer Garden Dress",
    price: 9800,
    salePrice: 8900,
    shortDescription:
      "Fresh pastel summer silhouette with light embroidery and comfortable premium lining.",
    fullDescription:
      "Made for daytime events and elegant casual wear, this soft summer design keeps movement easy while preserving the dressed-up feel expected from a luxury girls wear label.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Formal Pret",
    season: "Summer",
    fabricType: "Cotton Net",
    collection: "Gulzar Edit",
    section: "Seasonal Collection",
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    stockStatus: "in-stock",
  },
  {
    title: "Atelier Signature Velvet Edit",
    price: 18200,
    salePrice: null,
    shortDescription:
      "Rich winter velvet statement piece with formal embroidery and couture finishing.",
    fullDescription:
      "Built for winter festivities, this atelier signature dress uses plush velvet and metallic embroidery accents to create depth, softness, and an elevated festive presence.",
    images: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Festive Wear",
    season: "Winter",
    fabricType: "Velvet",
    collection: "Atelier Signature",
    section: "Featured Collection",
    isFeatured: true,
    isNewArrival: false,
    isActive: true,
    stockStatus: "limited",
  },
  {
    title: "Eid Blossom Occasion Dress",
    price: 13200,
    salePrice: 11800,
    shortDescription:
      "Celebration-ready Eid dress with polished embroidery, volume, and comfort-focused finishing.",
    fullDescription:
      "A joyful festive design created for long family gatherings and portraits, with balanced embellishment and careful finishing that keeps the piece lightweight yet premium.",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Eid Edit",
    season: "Festive",
    fabricType: "Silk",
    collection: "Meher Festive",
    section: "New Arrivals",
    isFeatured: false,
    isNewArrival: true,
    isActive: true,
    stockStatus: "in-stock",
  },
];

const run = async () => {
  try {
    await connectDB();

    for (const product of demoProducts) {
      const slug = slugify(product.title);

      await Product.findOneAndUpdate(
        { slug },
        {
          ...product,
          slug,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    const totalProducts = await Product.countDocuments();
    console.log(`Seed complete. Catalog now has ${totalProducts} product(s).`);
  } catch (error) {
    console.error("Product seed failed.", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
