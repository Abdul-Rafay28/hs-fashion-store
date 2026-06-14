import { useEffect, useState } from "react";

import {
  categoryOptions,
  collectionOptions,
  fabricOptions,
  sectionOptions,
  seasonOptions,
  stockOptions,
} from "../assets/brandData";
import uploadService from "../services/uploadService";
import styles from "../styles/product-form.module.css";

const defaultState = {
  title: "",
  price: "",
  salePrice: "",
  shortDescription: "",
  fullDescription: "",
  images: [],
  category: categoryOptions[0],
  season: seasonOptions[0],
  fabricType: fabricOptions[0],
  collection: collectionOptions[0],
  section: sectionOptions[0],
  isFeatured: false,
  isNewArrival: true,
  isActive: true,
  stockStatus: "in-stock",
};

const ProductForm = ({ initialValues, onSubmit, submitting, mode = "create" }) => {
  const [formState, setFormState] = useState(defaultState);
  const [uploading, setUploading] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);
  const [uploadStatusLoading, setUploadStatusLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchUploadStatus = async () => {
      try {
        const status = await uploadService.getStatus();

        if (mounted) {
          setCloudinaryConfigured(Boolean(status.cloudinaryConfigured));
        }
      } catch (statusError) {
        if (mounted) {
          setCloudinaryConfigured(false);
        }
      } finally {
        if (mounted) {
          setUploadStatusLoading(false);
        }
      }
    };

    fetchUploadStatus();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialValues) {
      setFormState(defaultState);
      return;
    }

    setFormState({
      ...defaultState,
      ...initialValues,
      price: initialValues.price ?? "",
      salePrice: initialValues.salePrice ?? "",
      images: initialValues.images || [],
    });
  }, [initialValues]);

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    updateField(name, type === "checkbox" ? checked : value);
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    if (!cloudinaryConfigured) {
      setError(
        "Cloudinary is not configured yet. Paste a hosted image URL below, or add Cloudinary credentials in backend/.env first.",
      );
      event.target.value = "";
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploadedImages = await uploadService.uploadImages(files);
      setFormState((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages.map((image) => image.url)],
      }));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (imageUrl) => {
    updateField(
      "images",
      formState.images.filter((image) => image !== imageUrl),
    );
  };

  const handleAddManualImage = () => {
    const trimmedUrl = manualImageUrl.trim();

    if (!trimmedUrl) {
      return;
    }

    const isDuplicate = formState.images.includes(trimmedUrl);

    if (isDuplicate) {
      setError("This image URL is already attached.");
      return;
    }

    setError("");
    updateField("images", [...formState.images, trimmedUrl]);
    setManualImageUrl("");
  };

  const handleManualImageKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    handleAddManualImage();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const pendingManualImage = manualImageUrl.trim();
    const nextImages =
      pendingManualImage && !formState.images.includes(pendingManualImage)
        ? [...formState.images, pendingManualImage]
        : formState.images;

    try {
      await onSubmit({
        ...formState,
        images: nextImages,
        price: Number(formState.price),
        salePrice: formState.salePrice === "" ? null : Number(formState.salePrice),
      });

      if (nextImages !== formState.images) {
        setFormState((current) => ({
          ...current,
          images: nextImages,
        }));
        setManualImageUrl("");
      }
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.sectionGrid}>
        <section className="luxury-card section-stack">
          <div className="section-heading">
            <p className="eyebrow">Product details</p>
            <h3>{mode === "edit" ? "Refine the product edit" : "Create a new luxury piece"}</h3>
          </div>

          <div className="field-grid">
            <label className="field-label">
              Product title
              <input
                className="soft-input"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                required
              />
            </label>

            <div className={styles.twoColumn}>
              <label className="field-label">
                Price
                <input
                  className="soft-input"
                  name="price"
                  type="number"
                  min="1"
                  value={formState.price}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field-label">
                Sale price
                <input
                  className="soft-input"
                  name="salePrice"
                  type="number"
                  min="0"
                  value={formState.salePrice}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <label className="field-label">
              Short description
              <textarea
                className="soft-textarea"
                name="shortDescription"
                value={formState.shortDescription}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="field-label">
              Full description
              <textarea
                className="soft-textarea"
                name="fullDescription"
                value={formState.fullDescription}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </section>

        <section className="luxury-card section-stack">
          <div className="section-heading">
            <p className="eyebrow">Catalog metadata</p>
            <h3>Organize the collection</h3>
          </div>

          <div className={styles.threeColumn}>
            <label className="field-label">
              Category
              <select
                className="pill-select"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
              >
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
                name="season"
                value={formState.season}
                onChange={handleInputChange}
              >
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
                name="collection"
                value={formState.collection}
                onChange={handleInputChange}
              >
                {collectionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Fabric type
              <select
                className="pill-select"
                name="fabricType"
                value={formState.fabricType}
                onChange={handleInputChange}
              >
                {fabricOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Section
              <select
                className="pill-select"
                name="section"
                value={formState.section}
                onChange={handleInputChange}
              >
                {sectionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-label">
              Stock status
              <select
                className="pill-select"
                name="stockStatus"
                value={formState.stockStatus}
                onChange={handleInputChange}
              >
                {stockOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.togglePanel}>
            <label className={styles.switchRow}>
              <input
                name="isFeatured"
                type="checkbox"
                checked={formState.isFeatured}
                onChange={handleInputChange}
              />
              <span>Show in featured collection</span>
            </label>

            <label className={styles.switchRow}>
              <input
                name="isNewArrival"
                type="checkbox"
                checked={formState.isNewArrival}
                onChange={handleInputChange}
              />
              <span>Mark as new arrival</span>
            </label>

            <label className={styles.switchRow}>
              <input
                name="isActive"
                type="checkbox"
                checked={formState.isActive}
                onChange={handleInputChange}
              />
              <span>Show product on storefront</span>
            </label>
          </div>
        </section>
      </div>

      <section className="luxury-card section-stack">
        <div className="section-heading">
          <p className="eyebrow">Cloudinary uploads</p>
          <h3>Product image gallery</h3>
          <p>
            Upload up to 8 images at a time. Add front-to-side-to-back angles in order for the
            premium 360 viewer on the product page.
          </p>
        </div>

        <div className={styles.uploadBar}>
          <label
            className={`button button--secondary ${!cloudinaryConfigured ? styles.disabledUpload : ""}`}
            htmlFor="product-images"
          >
            {uploadStatusLoading
              ? "Checking upload setup..."
              : uploading
                ? "Uploading..."
                : cloudinaryConfigured
                  ? "Upload images"
                  : "Cloudinary not configured"}
          </label>
          <input
            className="sr-only"
            id="product-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!cloudinaryConfigured || uploadStatusLoading}
          />
          <span className="muted-text">{formState.images.length} image(s) attached</span>
        </div>

        <div className={styles.manualImageRow}>
          <input
            className="soft-input"
            type="url"
            value={manualImageUrl}
            onChange={(event) => setManualImageUrl(event.target.value)}
            onKeyDown={handleManualImageKeyDown}
            placeholder="Or paste a hosted image URL"
          />
          <button
            className="button button--ghost"
            type="button"
            onClick={handleAddManualImage}
          >
            Add image URL
          </button>
        </div>

        <p className="muted-text">
          {cloudinaryConfigured
            ? "Cloudinary is connected. Uploaded image URLs will be saved directly into this product and used in the interactive product viewer."
            : "Cloudinary uploads are disabled right now because credentials are missing. You can still create products by pasting hosted image URLs here, or add Cloudinary credentials in backend/.env."}
        </p>

        <div className={styles.imageGrid}>
          {formState.images.map((image) => (
            <article key={image} className={styles.imageCard}>
              <img src={image} alt="Product preview" />
              <button
                className="button button--ghost"
                type="button"
                onClick={() => handleRemoveImage(image)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <div className={styles.actions}>
        <button className="button" type="submit" disabled={submitting || uploading}>
          {submitting ? "Saving..." : mode === "edit" ? "Update product" : "Create product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
