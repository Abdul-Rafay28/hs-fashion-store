import { motion } from "framer-motion";

const AnimatedSection = ({ children, className = "" }) => (
  <motion.section
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.section>
);

export default AnimatedSection;

