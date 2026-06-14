import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "../styles/product-gallery.module.css";

const DRAG_THRESHOLD = 28;
const AUTO_SPIN_DELAY = 2400;

const ProductGallery = ({ images = [], title }) => {
  const galleryImages = useMemo(() => [...new Set(images.filter(Boolean))], [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoSpinEnabled, setAutoSpinEnabled] = useState(galleryImages.length > 1);
  const [stageActive, setStageActive] = useState(false);
  const stageRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    lastClientX: 0,
    pointerId: null,
  });
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, {
    stiffness: 160,
    damping: 22,
    mass: 0.65,
  });
  const smoothRotateY = useSpring(rotateY, {
    stiffness: 160,
    damping: 22,
    mass: 0.65,
  });
  const hasMultipleImages = galleryImages.length > 1;

  useEffect(() => {
    setActiveIndex(0);
    setAutoSpinEnabled(galleryImages.length > 1);
  }, [galleryImages, title]);

  useEffect(() => {
    if (!hasMultipleImages || !autoSpinEnabled || stageActive) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, AUTO_SPIN_DELAY);

    return () => window.clearInterval(intervalId);
  }, [autoSpinEnabled, galleryImages.length, hasMultipleImages, stageActive]);

  if (!galleryImages.length) {
    return null;
  }

  const releasePointer = (target) => {
    const { pointerId } = dragStateRef.current;

    if (pointerId !== null && target?.hasPointerCapture?.(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    dragStateRef.current = {
      isDragging: false,
      lastClientX: 0,
      pointerId: null,
    };
  };

  const updateTilt = (clientX, clientY) => {
    if (!stageRef.current) {
      return;
    }

    const bounds = stageRef.current.getBoundingClientRect();
    const xProgress = (clientX - bounds.left) / bounds.width;
    const yProgress = (clientY - bounds.top) / bounds.height;

    rotateY.set((xProgress - 0.5) * 18);
    rotateX.set((0.5 - yProgress) * 16);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const stepImage = (direction, manual = true) => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);

    if (manual) {
      setAutoSpinEnabled(false);
    }
  };

  const selectImage = (index) => {
    setActiveIndex(index);
    setAutoSpinEnabled(false);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      lastClientX: event.clientX,
      pointerId: event.pointerId ?? null,
    };

    setStageActive(true);
    setAutoSpinEnabled(false);
    updateTilt(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    updateTilt(event.clientX, event.clientY);

    const dragState = dragStateRef.current;

    if (!dragState.isDragging || !hasMultipleImages) {
      return;
    }

    const delta = event.clientX - dragState.lastClientX;

    if (Math.abs(delta) < DRAG_THRESHOLD) {
      return;
    }

    stepImage(delta > 0 ? -1 : 1);
    dragStateRef.current.lastClientX = event.clientX;
  };

  const handlePointerLeave = (event) => {
    setStageActive(false);
    releasePointer(event.currentTarget);
    resetTilt();
  };

  const handlePointerUp = (event) => {
    releasePointer(event.currentTarget);
  };

  const handleStageKeyDown = (event) => {
    if (!hasMultipleImages) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepImage(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepImage(1);
    }
  };

  const progressWidth = `${((activeIndex + 1) / galleryImages.length) * 100}%`;
  const viewerLabel = hasMultipleImages ? "360 Atelier View" : "3D Spotlight View";
  const viewerHint = hasMultipleImages
    ? "Drag, swipe, or use the arrows to rotate through the dress angles."
    : "Move your cursor or finger across the frame for a premium depth-focused presentation.";
  const viewerStatus = hasMultipleImages ? "Interactive spin ready" : "Interactive depth ready";
  const viewerSupport = hasMultipleImages
    ? "For the smoothest spin, keep angle photos in order from front to side to back."
    : "Upload 4 to 8 angle photos from the admin panel to unlock a fuller rotating 360 experience.";

  return (
    <div className={styles.gallery}>
      <section className={styles.mainImage}>
        <div className={styles.viewerMeta}>
          <div className={styles.viewerCopy}>
            <span className={styles.viewerBadge}>{viewerLabel}</span>
            <p className={styles.viewerHint}>{viewerHint}</p>
          </div>

          <div className={styles.viewerCounter}>
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
            <span>{hasMultipleImages ? `${galleryImages.length} angles` : "Hero angle"}</span>
          </div>
        </div>

        <div className={styles.viewerChrome}>
          <motion.div
            ref={stageRef}
            className={styles.viewerStage}
            tabIndex={0}
            onKeyDown={handleStageKeyDown}
            onPointerDown={handlePointerDown}
            onPointerEnter={() => setStageActive(true)}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className={styles.stageGlow} />
            <div className={styles.stageHalo} />

            {hasMultipleImages ? (
              <button
                className={`${styles.arrowButton} ${styles.arrowPrev}`}
                type="button"
                aria-label="Show previous angle"
                onClick={() => stepImage(-1)}
              >
                <span aria-hidden="true">‹</span>
              </button>
            ) : null}

            <motion.div
              className={styles.imageFrame}
              style={{
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                transformPerspective: 1800,
              }}
            >
              <div className={styles.imageViewport}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryImages[activeIndex]}
                    src={galleryImages[activeIndex]}
                    alt={`${title} angle ${activeIndex + 1}`}
                    className={styles.heroImage}
                    draggable="false"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
              </div>
            </motion.div>

            {hasMultipleImages ? (
              <button
                className={`${styles.arrowButton} ${styles.arrowNext}`}
                type="button"
                aria-label="Show next angle"
                onClick={() => stepImage(1)}
              >
                <span aria-hidden="true">›</span>
              </button>
            ) : null}

            <div className={styles.spinOverlay}>
              <div className={styles.spinCopy}>
                <span>{autoSpinEnabled && hasMultipleImages ? "Auto spin preview on" : viewerStatus}</span>
                <strong>{hasMultipleImages ? "Swipe, drag, or tap arrows" : "Move pointer for depth"}</strong>
              </div>

              <div className={styles.spinMeter} aria-hidden="true">
                <span style={{ width: progressWidth }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <article className={styles.viewerNote}>
        <strong>{hasMultipleImages ? "360-ready image order" : "Unlock fuller 360 rotation"}</strong>
        <p>{viewerSupport}</p>
      </article>

      {hasMultipleImages ? (
        <>
          <div className={styles.thumbnailHeader}>
            <strong>Angle selector</strong>
            <span>Choose any frame directly or keep dragging inside the viewer.</span>
          </div>

          <div className={styles.thumbnailRow}>
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={`${styles.thumbnail} ${activeIndex === index ? styles.thumbnailActive : ""}`}
                type="button"
                aria-label={`Show ${title} angle ${index + 1}`}
                onClick={() => selectImage(index)}
              >
                <img src={image} alt={`${title} view ${index + 1}`} />
                <span>{`Angle ${String(index + 1).padStart(2, "0")}`}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductGallery;
