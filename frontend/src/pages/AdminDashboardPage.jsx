import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoadingBlock from "../components/LoadingBlock";
import StatsCard from "../components/StatsCard";
import productService from "../services/productService";
import styles from "../styles/pages.module.css";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const [statsData, productsData] = await Promise.all([
          productService.getAdminStats(),
          productService.getProducts({
            includeInactive: true,
            limit: 6,
            sort: "latest",
          }),
        ]);

        if (mounted) {
          setStats(statsData);
          setRecentProducts(productsData.items);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingBlock label="Loading dashboard..." />;
  }

  return (
    <motion.div
      className="section-stack"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <section className="page-hero section-stack">
        <p className="eyebrow">Dashboard overview</p>
        <h1>Keep the catalog polished and current.</h1>
        <p>
          Spotlight featured pieces, watch the newest arrivals, and manage every product
          touchpoint without leaving the admin workspace.
        </p>
      </section>

      <section className={styles.statsGrid}>
        <StatsCard label="Total products" value={stats?.totalProducts || 0} />
        <StatsCard label="Featured products" value={stats?.featuredProducts || 0} />
        <StatsCard label="New arrivals" value={stats?.newArrivals || 0} />
        <StatsCard label="Active products" value={stats?.activeProducts || 0} />
      </section>

      <section className="luxury-card section-stack">
        <div className={styles.panelHeader}>
          <div>
            <p className="eyebrow">Recent additions</p>
            <h2>Latest catalog activity</h2>
          </div>
          <Link className="button button--secondary" to="/admin/products/new">
            Add product
          </Link>
        </div>

        <div className={styles.recentList}>
          {recentProducts.map((product) => (
            <article key={product._id} className={styles.recentProduct}>
              <img src={product.images?.[0]} alt={product.title} />
              <div>
                <strong>{product.title}</strong>
                <span>
                  {product.category} • {product.collection}
                </span>
              </div>
              <Link className="button button--ghost" to={`/admin/products/${product._id}/edit`}>
                Edit
              </Link>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default AdminDashboardPage;
