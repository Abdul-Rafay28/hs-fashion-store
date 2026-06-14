import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { brandEmail, buildWhatsAppLink, formatPrice } from "../assets/brandData";
import LoadingBlock from "../components/LoadingBlock";
import ProductGallery from "../components/ProductGallery";
import ProductGrid from "../components/ProductGrid";
import productService from "../services/productService";
import styles from "../styles/pages.module.css";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await productService.getProductDetails(slug);

        if (mounted) {
          setProduct(data);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const inquiryLink = product
    ? `mailto:${brandEmail}?subject=${encodeURIComponent(
        `Inquiry for ${product.title}`,
      )}&body=${encodeURIComponent(
        [
          "Hello,",
          `I would like more details about ${product.title}.`,
          `Category: ${product.category}`,
          `Price: ${formatPrice(product.salePrice || product.price)}`,
          "",
          "Please share size availability and delivery timelines.",
        ].join("\n"),
      )}`
    : "#";

  if (loading) {
    return (
      <div className="container page-shell">
        <LoadingBlock label="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container page-shell">
        <section className="page-hero section-stack">
          <p className="eyebrow">Product unavailable</p>
          <h1>We could not load this piece right now.</h1>
          <p>{error || "Please return to the shop and choose another product."}</p>
          <div className="hero-actions">
            <Link className="button" to="/shop">
              Back to shop
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="container">
        <div className={styles.detailsGrid}>
          <ProductGallery images={product.images} title={product.title} />

          <section className={`luxury-card section-stack ${styles.productSummaryCard}`}>
            <p className="eyebrow">{product.collection}</p>
            <h1>{product.title}</h1>
            <p className={styles.productLead}>{product.shortDescription}</p>

            <div className={styles.priceStack}>
              <strong>{formatPrice(product.salePrice || product.price)}</strong>
              {product.salePrice ? <small>{formatPrice(product.price)}</small> : null}
            </div>

            <div className={`badge-row ${styles.detailMetaRow}`}>
              <span className="badge">{product.category}</span>
              <span className="badge">{product.season}</span>
              <span className="badge">{product.stockStatus}</span>
              <span className="badge">
                {product.images?.length > 1 ? "360 interactive view" : "3D visual focus"}
              </span>
              {product.isFeatured ? <span className="badge">Featured</span> : null}
              {product.isNewArrival ? <span className="badge">New arrival</span> : null}
            </div>

            <div className={`hero-actions ${styles.productActions}`}>
              <a className="button" href={buildWhatsAppLink(product)} rel="noreferrer" target="_blank">
                Order on WhatsApp
              </a>
              <a className="button button--secondary" href={inquiryLink}>
                Send inquiry
              </a>
            </div>

            <div className={styles.specGrid}>
              <article className="luxury-card">
                <span>Fabric</span>
                <strong>{product.fabricType}</strong>
              </article>
              <article className="luxury-card">
                <span>Collection</span>
                <strong>{product.collection}</strong>
              </article>
              <article className="luxury-card">
                <span>Section</span>
                <strong>{product.section}</strong>
              </article>
            </div>

            <div className="section-stack">
              <h3>About this piece</h3>
              <p>{product.fullDescription}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="container">
        <section className={`section-stack section-shell ${styles.relatedShell}`}>
          <div className="section-heading">
            <p className="eyebrow">Related products</p>
            <h2>More designs from the same luxury world.</h2>
          </div>
          <ProductGrid
            products={product.relatedProducts}
            emptyTitle="No related pieces found"
            emptyDescription="Add more products in the same category or collection to enrich this section."
            layout="related"
          />
        </section>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
