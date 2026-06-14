import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import LoadingBlock from "../components/LoadingBlock";
import ProductForm from "../components/ProductForm";
import productService from "../services/productService";

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let mounted = true;

    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);

        if (mounted) {
          setProduct(data);
        }
      } catch (error) {
        if (mounted) {
          setLoadError(error.message);
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
  }, [id, isEditMode]);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      if (isEditMode) {
        await productService.updateProduct(id, values);
      } else {
        await productService.createProduct(values);
      }

      navigate("/admin/products");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingBlock label="Loading product..." />;
  }

  if (loadError) {
    return (
      <div className="section-stack">
        <section className="page-hero section-stack">
          <p className="eyebrow">Unable to load product</p>
          <h1>The edit page could not be opened.</h1>
          <p>{loadError}</p>
          <div className="hero-actions">
            <Link className="button button--secondary" to="/admin/products">
              Back to products
            </Link>
          </div>
        </section>
      </div>
    );
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
        <p className="eyebrow">{isEditMode ? "Edit product" : "New product"}</p>
        <h1>{isEditMode ? "Refine this product entry." : "Create a premium catalog listing."}</h1>
        <p>
          Upload clean imagery, keep the metadata consistent, and decide where the piece
          should appear across the storefront.
        </p>
        <div className="hero-actions">
          <Link className="button button--secondary" to="/admin/products">
            Back to products
          </Link>
        </div>
      </section>

      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        submitting={submitting}
        mode={isEditMode ? "edit" : "create"}
      />
    </motion.div>
  );
};

export default AdminProductFormPage;
