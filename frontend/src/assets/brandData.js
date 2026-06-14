export const brandName = import.meta.env.VITE_BRAND_NAME || "Hoorain Shakeel";
export const brandEmail = import.meta.env.VITE_BRAND_EMAIL || "atelier@haseenstudio.com";
export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "923000000000";

export const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Featured", path: "/featured" },
  { label: "New Arrivals", path: "/new-arrivals" },
];

export const categoryOptions = [
  "Luxury Frocks",
  "Festive Wear",
  "Mini Bridal",
  "Party Wear",
  "Formal Pret",
  "Eid Edit",
];

export const seasonOptions = [
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "Festive",
  "Wedding",
];

export const collectionOptions = [
  "Noor Collection",
  "Meher Festive",
  "Zaria Couture",
  "Gulzar Edit",
  "Atelier Signature",
];

export const fabricOptions = [
  "Organza",
  "Cotton Net",
  "Silk",
  "Chiffon",
  "Velvet",
  "Raw Silk",
];

export const sectionOptions = [
  "Featured Collection",
  "New Arrivals",
  "Seasonal Collection",
  "Atelier Signature",
];

export const stockOptions = [
  { label: "In Stock", value: "in-stock" },
  { label: "Limited", value: "limited" },
  { label: "Made To Order", value: "made-to-order" },
  { label: "Out Of Stock", value: "out-of-stock" },
];

export const heroMetrics = [
  { value: "12+", label: "Years shaping festive silhouettes in-house" },
  { value: "3k+", label: "Pieces finished with embroidery-led detailing" },
  { value: "100%", label: "Factory-controlled production and final review" },
];

export const categoryCards = [
  {
    title: "Luxury Frocks",
    description: "Statement silhouettes with luminous threadwork and couture finishing.",
    filter: "Luxury Frocks",
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Festive Wear",
    description: "Celebration-ready dresses crafted for Eid, dinners, and joyful family gatherings.",
    filter: "Festive Wear",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Mini Bridal",
    description: "Heirloom-inspired pieces with graceful volume and delicate finishing touches.",
    filter: "Mini Bridal",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
];

export const editorialCards = [
  {
    title: "Noor Collection",
    description: "A luminous edit of pearl embroidery, soft blush palettes, and poised occasion silhouettes.",
  },
  {
    title: "Atelier Signature",
    description: "Our most intricate craftsmanship, cut and embroidered inside our own production floor.",
  },
  {
    title: "Wedding Season",
    description: "Ceremony-worthy dresses with elevated handfeel, layered textures, and graceful movement.",
  },
];

export const trustHighlights = [
  {
    title: "Owned Factory",
    description: "Every piece is produced inside our own facility for tighter quality control.",
  },
  {
    title: "Embroidery Machines",
    description: "Precision embroidery is handled in-house for cleaner execution and faster refinement.",
  },
  {
    title: "Premium Finishing",
    description: "Lining, trims, and final pressing follow boutique-level finishing standards.",
  },
];

export const craftsmanshipStats = [
  { value: "24-step", label: "Quality review before dispatch" },
  { value: "8-machine", label: "Embroidery production line" },
  { value: "48-hour", label: "Average admin response for custom inquiries" },
];

export const atelierFeatures = [
  "Pattern development and cutting are managed under one roof.",
  "Luxury trims and embroidery placement are inspected before stitching begins.",
  "Final garments are pressed, packed, and catalogued by our in-house team.",
];

export const instagramGallery = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
];

export const quickLinks = [
  { label: "Shop all dresses", path: "/shop" },
  { label: "Featured collection", path: "/featured" },
  { label: "New arrivals", path: "/new-arrivals" },
  { label: "Admin panel", path: "/admin/login" },
];

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price || 0);

export const buildWhatsAppLink = (product) => {
  const message = [
    "Hello,",
    "I am interested in this product.",
    "",
    `Product: ${product.title}`,
    `Price: ${formatPrice(product.salePrice || product.price)}`,
    `Category: ${product.category}`,
    "",
    "Please provide more details.",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};
