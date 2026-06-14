import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { categoryOptions, seasonOptions } from "../assets/brandData";
import EmptyState from "../components/EmptyState";
import LoadingBlock from "../components/LoadingBlock";
import useDebouncedValue from "../hooks/useDebouncedValue";
import productService from "../services/productService";
import styles from "../styles/pages.module.css";

const AdminProductsPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    season: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(filters.search, 250);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const data = await productService.getProducts({
        includeInactive: true,
        search: debouncedSearch,
        category: filters.category,
        season: filters.season,
        sort: "latest",
        limit: 24,
      });

      setProducts(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, filters.category, filters.season]);

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product permanently?");

    if (!confirmed) {
      return;
    }

    await productService.deleteProduct(productId);
    await fetchProducts();
  };

  return (
    <motion.div
      className="section-stack"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <section className="page-hero section-stack">
        <div className={styles.panelHeader}>
          <div>
            <p className="eyebrow">Catalog manager</p>
            <h1>Search, filter, and refine every product listing.</h1>
          </div>
          <Link className="button" to="/admin/products/new">
            Add new product
          </Link>
        </div>
      </section>

      <section className="luxury-card section-stack">
        <div className={styles.filterToolbar}>
          <input
            className="soft-input"
            type="search"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
            placeholder="Search title, category, season..."
          />

          <select
            className="pill-select"
            value={filters.category}
            onChange={(event) => handleFilterChange("category", event.target.value)}
          >
            <option value="">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className="pill-select"
            value={filters.season}
            onChange={(event) => handleFilterChange("season", event.target.value)}
          >
            <option value="">All seasons</option>
            {seasonOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingBlock label="Loading products..." />
        ) : products.length ? (
          <div className="table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Product</th>
                  <th>Collection</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        className="table-thumbnail"
                        src={product.images?.[0]}
                        alt={product.title}
                      />
                    </td>
                    <td>
                      <strong>{product.title}</strong>
                      <span className="muted-text">
                        {product.category} • {product.season}
                      </span>
                    </td>
                    <td>{product.collection}</td>
                    <td>
                      <div className="badge-row">
                        <span className="badge">{product.isActive ? "Active" : "Hidden"}</span>
                        {product.isFeatured ? <span className="badge">Featured</span> : null}
                        {product.isNewArrival ? <span className="badge">New</span> : null}
                      </div>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <Link
                          className="button button--ghost"
                          to={`/admin/products/${product._id}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="button button--secondary"
                          type="button"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="Create your first product or broaden the filters to see more results."
            action={
              <Link className="button" to="/admin/products/new">
                Create product
              </Link>
            }
          />
        )}
      </section>
    </motion.div>
  );
};

export default AdminProductsPage;

