import EmptyState from "./EmptyState";
import ProductCard from "./ProductCard";
import styles from "../styles/product-card.module.css";

const ProductGrid = ({
  products,
  emptyTitle,
  emptyDescription,
  emptyAction = null,
  layout = "default",
}) => {
  if (!products?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={`${styles.grid} ${layout === "related" ? styles.relatedGrid : ""}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
