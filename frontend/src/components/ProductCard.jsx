import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { formatPrice } from "../assets/brandData";
import styles from "../styles/product-card.module.css";

const ProductCard = ({ product }) => {
  const effectivePrice = product.salePrice || product.price;
  const stockLabel = product.stockStatus?.replaceAll("-", " ");
  const hasSpinView = (product.images?.length || 0) > 1;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link className={styles.imageWrap} to={`/product/${product.slug}`}>
        <img src={product.images?.[0]} alt={product.title} />
        <div className={styles.imageOverlay} />
        <div className={styles.badges}>
          {product.isFeatured ? <span>Featured</span> : null}
          {product.isNewArrival ? <span>New</span> : null}
        </div>
        <span className={styles.viewPrompt}>{hasSpinView ? "View in 360" : "View piece"}</span>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{product.category}</span>
          <span>{product.collection}</span>
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3>{product.title}</h3>
        </Link>

        <p>{product.shortDescription}</p>

        <div className={styles.footer}>
          <div className={styles.priceStack}>
            <strong>{formatPrice(effectivePrice)}</strong>
            {product.salePrice ? <small>{formatPrice(product.price)}</small> : null}
          </div>

          <div className={styles.cardActionRow}>
            <span className={styles.stockNote}>{stockLabel}</span>
            <Link className="button button--secondary" to={`/product/${product.slug}`}>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
