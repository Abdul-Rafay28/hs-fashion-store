import {
  categoryOptions,
  collectionOptions,
  seasonOptions,
} from "../assets/brandData";
import styles from "../styles/product-filters.module.css";

const ProductFilters = ({
  filters,
  onChange,
  onReset,
  title = "Refine the collection",
  description = "Search instantly and narrow the edit by category, season, and collection.",
  showPromotionToggles = true,
  lockedNotice = "",
}) => (
  <aside className={styles.filters}>
    <div className="section-stack">
      <div className="section-heading">
        <p className="eyebrow">Filters</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <label className="field-label">
        Search
        <input
          className="soft-input"
          type="search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search title, category, season..."
        />
      </label>

      <label className="field-label">
        Category
        <select
          className="pill-select"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Season
        <select
          className="pill-select"
          value={filters.season}
          onChange={(event) => onChange("season", event.target.value)}
        >
          <option value="">All seasons</option>
          {seasonOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Collection
        <select
          className="pill-select"
          value={filters.collection}
          onChange={(event) => onChange("collection", event.target.value)}
        >
          <option value="">All collections</option>
          {collectionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Sort by
        <select
          className="pill-select"
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
        >
          <option value="latest">Latest arrivals</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="featured">Featured first</option>
        </select>
      </label>

      {showPromotionToggles ? (
        <div className={styles.toggleGrid}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={filters.isFeatured}
              onChange={(event) => onChange("isFeatured", event.target.checked)}
            />
            <span>Featured only</span>
          </label>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={filters.isNewArrival}
              onChange={(event) => onChange("isNewArrival", event.target.checked)}
            />
            <span>New arrivals only</span>
          </label>
        </div>
      ) : null}

      {lockedNotice ? <p className={styles.lockedNotice}>{lockedNotice}</p> : null}

      <button className="button button--ghost" type="button" onClick={onReset}>
        Reset filters
      </button>
    </div>
  </aside>
);

export default ProductFilters;
