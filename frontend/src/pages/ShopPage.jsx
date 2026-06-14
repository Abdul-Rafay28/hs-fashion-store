import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import LoadingBlock from "../components/LoadingBlock";
import productService from "../services/productService";
import styles from "../styles/pages.module.css";

const pageConfigs = {
  shop: {
    eyebrow: "Shop the edit",
    title: "Premium occasion dresses with refined embroidery.",
    description:
      "Search instantly, sort by price or freshness, and browse by category, season, and collection.",
    highlights: ["Luxury silhouettes", "Live search", "Curated seasonal filters"],
    resultEyebrow: "Collection results",
    filterTitle: "Refine the collection",
    filterDescription:
      "Search instantly and narrow the edit by category, season, and collection.",
    showPromotionToggles: true,
    lockedNotice: "",
    lockedFilters: {},
    primaryAction: {
      label: "View featured edit",
      path: "/featured",
      className: "button button--secondary",
    },
    secondaryAction: {
      label: "See new arrivals",
      path: "/new-arrivals",
      className: "button button--ghost",
    },
    emptyTitle: "No products match this filter set",
    emptyDescription: "Try widening the search or resetting the filters to see more pieces.",
    panelTitle: "A cleaner way to browse",
    panelDescription:
      "Use the filter rail to quickly move between categories, festive edits, featured styles, and the latest launches without losing the premium storefront flow.",
  },
  featured: {
    eyebrow: "Featured collection",
    title: "Signature pieces curated as the brand's featured edit.",
    description:
      "This page highlights the designs we intentionally spotlight across the storefront, from couture-inspired silhouettes to our most refined embroidery work.",
    highlights: ["Brand spotlight", "Premium detailing", "Curated standout pieces"],
    resultEyebrow: "Featured results",
    filterTitle: "Refine featured pieces",
    filterDescription:
      "Filter the featured edit by category, season, collection, and search without leaving this premium selection.",
    showPromotionToggles: false,
    lockedNotice: "This page only shows products marked as featured.",
    lockedFilters: { isFeatured: true },
    primaryAction: {
      label: "Shop all products",
      path: "/shop",
      className: "button button--secondary",
    },
    secondaryAction: {
      label: "Browse new arrivals",
      path: "/new-arrivals",
      className: "button button--ghost",
    },
    emptyTitle: "No featured products are live right now",
    emptyDescription:
      "Mark products as featured from the admin dashboard to populate this curated edit.",
    panelTitle: "Why this page feels selective",
    panelDescription:
      "Only featured products appear here, helping the storefront read like a tighter editorial selection instead of a generic all-products grid.",
  },
  newArrivals: {
    eyebrow: "New arrivals",
    title: "Fresh launches with soft luxury detail and polished finishing.",
    description:
      "Browse the latest additions to the label, from festive statement dresses to newer seasonal pieces just added to the catalog.",
    highlights: ["Latest drops", "Fresh catalog additions", "Soft luxury finish"],
    resultEyebrow: "New arrival results",
    filterTitle: "Refine new arrivals",
    filterDescription:
      "Filter the latest launches by category, season, collection, and search while keeping the page focused on recent additions.",
    showPromotionToggles: false,
    lockedNotice: "This page only shows products marked as new arrivals.",
    lockedFilters: { isNewArrival: true },
    primaryAction: {
      label: "Shop all products",
      path: "/shop",
      className: "button button--secondary",
    },
    secondaryAction: {
      label: "See featured edit",
      path: "/featured",
      className: "button button--ghost",
    },
    emptyTitle: "No new arrivals are live right now",
    emptyDescription:
      "Mark products as new arrivals from the admin dashboard to fill this latest-launches page.",
    panelTitle: "Built for freshness",
    panelDescription:
      "This page stays focused on products marked as new arrivals, so repeat visitors can immediately see what was added most recently.",
  },
};

const ShopPage = ({ variant = "shop" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const filtersKey = searchParams.toString();
  const isFeaturedParam = searchParams.get("isFeatured");
  const isNewArrivalParam = searchParams.get("isNewArrival");
  const pageMode =
    variant !== "shop"
      ? variant
      : isFeaturedParam === "true"
        ? "featured"
        : isNewArrivalParam === "true"
          ? "newArrivals"
          : "shop";
  const pageConfig = pageConfigs[pageMode];

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    season: searchParams.get("season") || "",
    collection: searchParams.get("collection") || "",
    sort: searchParams.get("sort") || "latest",
    isFeatured:
      pageConfig.lockedFilters.isFeatured === true || isFeaturedParam === "true",
    isNewArrival:
      pageConfig.lockedFilters.isNewArrival === true || isNewArrivalParam === "true",
  };

  const requestFilters = {
    search: filters.search,
    category: filters.category,
    season: filters.season,
    collection: filters.collection,
    sort: filters.sort,
    limit: 12,
    ...pageConfig.lockedFilters,
  };

  if (pageMode === "shop" && isFeaturedParam === "true") {
    requestFilters.isFeatured = true;
  }

  if (pageMode === "shop" && isNewArrivalParam === "true") {
    requestFilters.isNewArrival = true;
  }

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await productService.getProducts(requestFilters);

        if (mounted) {
          setProducts(data.items);
          setPagination(data.pagination);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [filtersKey, pageMode]);

  const handleFilterChange = (field, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (
      value === "" ||
      value === false ||
      value === "latest" ||
      value === null ||
      typeof value === "undefined"
    ) {
      nextParams.delete(field);
    } else {
      nextParams.set(field, String(value));
    }

    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="container">
        <section className={`page-hero ${styles.shopHero}`}>
          <div className="section-stack">
            <p className="eyebrow">{pageConfig.eyebrow}</p>
            <h1>{pageConfig.title}</h1>
            <p>{pageConfig.description}</p>

            <div className={styles.heroPillRow}>
              {pageConfig.highlights.map((highlight) => (
                <span key={highlight} className={styles.heroPill}>
                  {highlight}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <Link
                className={pageConfig.primaryAction.className}
                to={pageConfig.primaryAction.path}
              >
                {pageConfig.primaryAction.label}
              </Link>
              <Link
                className={pageConfig.secondaryAction.className}
                to={pageConfig.secondaryAction.path}
              >
                {pageConfig.secondaryAction.label}
              </Link>
            </div>
          </div>

          <aside className={styles.shopHeroPanel}>
            <article className={styles.shopHeroCard}>
              <span>{pageMode === "shop" ? "Luxury browsing" : "Curated browsing"}</span>
              <h3>{pageConfig.panelTitle}</h3>
              <p>{pageConfig.panelDescription}</p>
            </article>
          </aside>
        </section>
      </div>

      <div className="container">
        <div className={styles.shopLayout}>
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            title={pageConfig.filterTitle}
            description={pageConfig.filterDescription}
            showPromotionToggles={pageConfig.showPromotionToggles}
            lockedNotice={pageConfig.lockedNotice}
          />

          <section className={`section-stack section-shell ${styles.resultsShell}`}>
            <div className={styles.shopToolbar}>
              <div>
                <p className="eyebrow">{pageConfig.resultEyebrow}</p>
                <h2>{pagination?.total || 0} pieces found</h2>
              </div>

              <Link className="button button--secondary" to="/admin/login">
                Manage catalog
              </Link>
            </div>

            {loading ? (
              <LoadingBlock label="Loading products..." />
            ) : (
              <ProductGrid
                products={products}
                emptyTitle={pageConfig.emptyTitle}
                emptyDescription={pageConfig.emptyDescription}
              />
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopPage;
