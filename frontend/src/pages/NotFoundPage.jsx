import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <motion.div
    className="container page-shell"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    <section className="page-hero section-stack">
      <p className="eyebrow">Page not found</p>
      <h1>This page slipped out of the collection.</h1>
      <p>Return to the storefront to continue browsing the luxury edit.</p>
      <div className="hero-actions">
        <Link className="button" to="/">
          Go home
        </Link>
        <Link className="button button--secondary" to="/shop">
          Visit shop
        </Link>
      </div>
    </section>
  </motion.div>
);

export default NotFoundPage;

