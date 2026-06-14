import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  brandName,
  formatPrice,
  navigationItems,
} from "../assets/brandData";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useAuth } from "../hooks/useAuth";
import productService from "../services/productService";
import styles from "../styles/header.module.css";

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 250);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const closeSearch = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearch);
    return () => document.removeEventListener("mousedown", closeSearch);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await productService.getSuggestions(debouncedQuery);

        if (mounted) {
          setSuggestions(results);
          setSearchOpen(true);
        }
      } catch (error) {
        if (mounted) {
          setSuggestions([]);
        }
      }
    };

    fetchSuggestions();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/product/${slug}`);
    setQuery("");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const closeDrawer = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.topRow}>
          <Link className={styles.brand} to="/">
            <span className={styles.brandMark}>HS</span>
            <span>
              <strong>{brandName}</strong>
              <small>Luxury embroidered girls wear</small>
            </span>
          </Link>

          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <form className={styles.search} onSubmit={handleSearchSubmit} ref={searchRef}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search dresses, categories, seasons..."
              aria-label="Search products"
            />
            <button className="button button--secondary" type="submit">
              Search
            </button>

            <AnimatePresence>
              {searchOpen && suggestions.length > 0 ? (
                <motion.div
                  className={styles.searchDropdown}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((product) => (
                    <button
                      key={product.slug}
                      className={styles.searchResult}
                      type="button"
                      onClick={() => handleSuggestionClick(product.slug)}
                    >
                      <img src={product.images?.[0]} alt={product.title} />
                      <span>
                        <strong>{product.title}</strong>
                        <small>
                          {product.category} • {formatPrice(product.salePrice || product.price)}
                        </small>
                      </span>
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            {navigationItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => (isActive ? styles.activeLink : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Link className="button" to={user ? "/admin" : "/admin/login"}>
            {user ? "Dashboard" : "Admin Login"}
          </Link>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              className={styles.drawerBackdrop}
              type="button"
              aria-label="Close navigation drawer"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.aside
              className={styles.mobileDrawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.drawerHeader}>
                <div>
                  <p className={styles.drawerEyebrow}>Navigation</p>
                  <strong>{brandName}</strong>
                </div>

                <button
                  className={styles.drawerClose}
                  type="button"
                  aria-label="Close menu"
                  onClick={closeDrawer}
                >
                  <span />
                  <span />
                </button>
              </div>

              <div className={styles.drawerPanel}>
                <p>Browse the storefront from one clean side menu on mobile.</p>
              </div>

              <div className={styles.drawerLinks}>
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`.trim()
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className={styles.drawerFooter}>
                <Link className="button" to={user ? "/admin" : "/admin/login"}>
                  {user ? "Dashboard" : "Admin Login"}
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
