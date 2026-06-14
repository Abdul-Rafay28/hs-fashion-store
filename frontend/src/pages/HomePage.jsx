import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  atelierFeatures,
  brandName,
  categoryCards,
  craftsmanshipStats,
  editorialCards,
  heroMetrics,
  instagramGallery,
  trustHighlights,
  whatsappNumber,
} from "../assets/brandData";
import AnimatedSection from "../components/AnimatedSection";
import EmptyState from "../components/EmptyState";
import LoadingBlock from "../components/LoadingBlock";
import ProductGrid from "../components/ProductGrid";
import productService from "../services/productService";
import styles from "../styles/pages.module.css";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [seasonalProducts, setSeasonalProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchSections = async () => {
      try {
        const [featuredResult, newArrivalResult, seasonalResult] = await Promise.allSettled([
          productService.getFeatured(4),
          productService.getNewArrivals(4),
          productService.getProducts({
            season: "Festive",
            limit: 4,
            sort: "latest",
          }),
        ]);

        if (!mounted) {
          return;
        }

        setFeaturedProducts(
          featuredResult.status === "fulfilled" ? featuredResult.value : [],
        );
        setNewArrivals(
          newArrivalResult.status === "fulfilled" ? newArrivalResult.value : [],
        );
        setSeasonalProducts(
          seasonalResult.status === "fulfilled" ? seasonalResult.value.items : [],
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSections();

    return () => {
      mounted = false;
    };
  }, []);

  const catalogShowcase = [...featuredProducts, ...newArrivals, ...seasonalProducts];
  const findCatalogImage = (matcher, fallback) =>
    catalogShowcase.find((product) => matcher(product) && product.images?.[0])?.images?.[0] ||
    fallback;
  const heroImage = findCatalogImage(
    (product) => product.isFeatured,
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  );
  const storyImage = findCatalogImage(
    (product) => product.isNewArrival,
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  );
  const factoryImage =
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80";

  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="container">
        <section className={`${styles.hero} ${styles.heroLuxury} page-hero`}>
          <div className={styles.heroContent}>
            <div className={styles.heroPillRow}>
              <span className={styles.heroPill}>Factory-owned atelier</span>
              <span className={styles.heroPill}>Signature embroidery finish</span>
              <span className={styles.heroPill}>WhatsApp styling support</span>
            </div>
            <p className="eyebrow">Luxury girls wear</p>
            <h1>Refined occasion dresses with couture softness and atelier precision.</h1>
            <p className={styles.heroLead}>
              {brandName} blends factory-owned production, premium finishing, and graceful
              silhouettes into pieces made for weddings, festivities, and portrait moments.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/shop">
                Explore the collection
              </Link>
              <a
                className="button button--secondary"
                href={`https://wa.me/${whatsappNumber}`}
                rel="noreferrer"
                target="_blank"
              >
                WhatsApp the atelier
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.imageStack}>
              <img src={heroImage} alt="Luxury embroidered girls dress" />
              <div className={styles.signatureCard}>
                <span>Signature atelier finish</span>
                <strong>Created, embroidered, and quality-checked under one roof.</strong>
                <p>That control keeps the finishing soft, balanced, and consistently premium.</p>
              </div>
            </div>
          </div>

          <div className={`${styles.metricsGrid} ${styles.heroStatsGrid}`}>
            {heroMetrics.map((metric) => (
              <article key={metric.label} className="luxury-card">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="container">
        <AnimatedSection className="section-stack">
          <div className="section-heading">
            <p className="eyebrow">Shop by category</p>
            <h2>Curated for celebrations, portraits, and treasured family moments.</h2>
          </div>

          <div className={styles.categoryGrid}>
            {categoryCards.map((card) => (
              <Link
                key={card.title}
                className={styles.categoryCard}
                to={`/shop?category=${encodeURIComponent(card.filter)}`}
              >
                <img src={card.image} alt={card.title} />
                <div className={styles.categoryCardContent}>
                  <p>Shop the edit</p>
                  <h3>{card.title}</h3>
                  <span>{card.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.editorialShell}`}>
          <div className="section-heading">
            <p className="eyebrow">Signature worlds</p>
            <h2>Three editorial directions that make the storefront feel more curated and high-end.</h2>
          </div>

          <div className={styles.editorialGrid}>
            {editorialCards.map((card, index) => (
              <article key={card.title} className={styles.editorialCard}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.collectionShowcase}`}>
          <div className="section-heading">
            <p className="eyebrow">Featured collection</p>
            <h2>Editorial silhouettes with premium detailing.</h2>
          </div>

          <div className="hero-actions">
            <Link className="button button--ghost" to="/featured">
              View featured edit
            </Link>
          </div>

          {loading ? (
            <LoadingBlock label="Loading featured collection..." />
          ) : featuredProducts.length ? (
            <ProductGrid
              products={featuredProducts}
              emptyTitle="Featured styles are on the way"
              emptyDescription="Use the admin dashboard to mark products as featured."
            />
          ) : (
            <EmptyState
              title="No featured products yet"
              description="Mark products as featured in the admin panel, or seed the demo catalog to populate this luxury section instantly."
              action={
                <div className="hero-actions">
                  <Link className="button" to="/admin/login">
                    Open admin panel
                  </Link>
                </div>
              }
            />
          )}
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.collectionShowcase}`}>
          <div className="section-heading">
            <p className="eyebrow">New arrivals</p>
            <h2>Freshly launched pieces with a soft, elevated finish.</h2>
          </div>

          <div className="hero-actions">
            <Link className="button button--ghost" to="/new-arrivals">
              View new arrivals
            </Link>
          </div>

          {loading ? (
            <LoadingBlock label="Loading new arrivals..." />
          ) : (
            <ProductGrid
              products={newArrivals}
              emptyTitle="No new arrivals yet"
              emptyDescription="Add products in the dashboard and mark them as new arrivals."
              emptyAction={
                <Link className="button" to="/admin/login">
                  Open admin panel
                </Link>
              }
            />
          )}
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`split-layout section-shell ${styles.storyShell}`}>
          <div className={`section-stack ${styles.storyContent}`}>
            <div className="section-heading">
              <p className="eyebrow">Brand story</p>
              <h2>A luxury fashion label with factory control and design intimacy.</h2>
            </div>
            <p>
              Our process starts with silhouette planning and ends only after the last stitch,
              press, and finishing check is complete. Because production lives inside our own
              factory, we can protect consistency without sacrificing creativity.
            </p>
            <div className="badge-row">
              <span className="badge">Premium fabrics</span>
              <span className="badge">In-house embroidery</span>
              <span className="badge">Quality-led finishing</span>
            </div>
          </div>

          <div className={styles.storyPanel}>
            <img src={storyImage} alt="Fashion atelier" />
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`split-layout section-shell ${styles.storyShell}`}>
          <div className={styles.factoryPanel}>
            <img src={factoryImage} alt="Embroidery craftsmanship" />
          </div>

          <div className={`section-stack ${styles.storyContent}`}>
            <div className="section-heading">
              <p className="eyebrow">Factory and embroidery</p>
              <h2>Every collection benefits from direct oversight, precise embroidery, and refined execution.</h2>
            </div>
            <div className="section-stack">
              {atelierFeatures.map((feature) => (
                <article key={feature} className="luxury-card">
                  <p>{feature}</p>
                </article>
              ))}
            </div>
            <div className={`${styles.metricsGrid} metrics-grid`}>
              {craftsmanshipStats.map((metric) => (
                <article key={metric.label} className="luxury-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.collectionShowcase}`}>
          <div className="section-heading">
            <p className="eyebrow">Seasonal collection</p>
            <h2>Pieces designed for festive calendars and wedding season elegance.</h2>
          </div>

          {loading ? (
            <LoadingBlock label="Loading seasonal edit..." />
          ) : (
            <ProductGrid
              products={seasonalProducts}
              emptyTitle="Seasonal edit coming soon"
              emptyDescription="Add festive or wedding-season pieces to spotlight them here."
            />
          )}
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.collectionShowcase}`}>
          <div className="section-heading">
            <p className="eyebrow">Customer trust</p>
            <h2>Premium service starts long before checkout.</h2>
          </div>

          <div className={`${styles.trustGrid} trust-grid`}>
            {trustHighlights.map((item) => (
              <article key={item.title} className="luxury-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-stack section-shell ${styles.galleryShell}`}>
          <div className="section-heading">
            <p className="eyebrow">Instagram-style gallery</p>
            <h2>Soft light, refined details, and the mood of modern occasion wear.</h2>
          </div>

          <div className="gallery-grid">
            {instagramGallery.map((image) => (
              <img key={image} src={image} alt="Collection gallery" />
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="container">
        <AnimatedSection className={`section-shell ${styles.ctaBand}`}>
          <div className={styles.ctaBandContent}>
            <div className="section-stack">
              <p className="eyebrow">Private inquiry</p>
              <h2>Want a quicker, more premium buying journey?</h2>
              <p>
                Share your preferred color story, delivery timeline, or event details on WhatsApp
                and we can guide you toward the right piece faster.
              </p>
            </div>

            <div className={styles.ctaBandActions}>
              <a
                className="button"
                href={`https://wa.me/${whatsappNumber}`}
                rel="noreferrer"
                target="_blank"
              >
                Start WhatsApp inquiry
              </a>
              <Link className="button button--secondary" to="/shop">
                View full collection
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default HomePage;
