import { motion } from "framer-motion";

import { whatsappNumber } from "../assets/brandData";
import styles from "../styles/floating-whatsapp.module.css";

const FloatingWhatsAppButton = () => (
  <motion.a
    className={styles.button}
    href={`https://wa.me/${whatsappNumber}`}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    initial={{ opacity: 0, y: 18, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
  >
    <span className={styles.ring} aria-hidden="true" />
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M27.2 4.7A15.12 15.12 0 0 0 16.44.02C8.08-.2 1.08 6.44.86 14.8a15.2 15.2 0 0 0 2.02 7.88L.22 31.8l9.36-2.46a15.1 15.1 0 0 0 6.78 1.62h.06c8.28 0 15.08-6.74 15.2-15.02A15.07 15.07 0 0 0 27.2 4.7Zm-10.78 23.7h-.04a12.52 12.52 0 0 1-6.38-1.74l-.46-.28-5.56 1.46 1.48-5.42-.3-.48a12.54 12.54 0 0 1-1.94-6.64c.18-6.92 5.98-12.48 12.9-12.3 3.28.08 6.34 1.42 8.62 3.78a12.43 12.43 0 0 1 3.6 8.88c-.1 6.8-5.66 12.24-12.42 12.24Zm6.82-9.34c-.38-.2-2.24-1.1-2.6-1.22-.34-.12-.6-.18-.86.2-.24.36-.98 1.22-1.2 1.46-.22.24-.42.28-.8.1-.36-.2-1.56-.58-2.96-1.84-1.1-.98-1.84-2.18-2.06-2.54-.22-.38-.02-.58.16-.78.16-.16.36-.42.54-.62.18-.22.24-.38.36-.64.12-.24.06-.48-.02-.68-.1-.18-.86-2.08-1.18-2.84-.32-.78-.64-.66-.86-.68h-.74c-.24 0-.64.1-.98.46-.34.38-1.3 1.28-1.3 3.12 0 1.84 1.34 3.62 1.52 3.86.2.24 2.62 4 6.46 5.62.9.4 1.62.64 2.18.82.92.3 1.76.26 2.42.16.74-.12 2.24-.92 2.56-1.8.32-.9.32-1.64.22-1.8-.08-.16-.34-.24-.72-.42Z"
        fill="currentColor"
      />
    </svg>
  </motion.a>
);

export default FloatingWhatsAppButton;
