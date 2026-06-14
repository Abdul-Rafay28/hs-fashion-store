import { Link } from "react-router-dom";

import {
  brandEmail,
  brandName,
  quickLinks,
  whatsappNumber,
} from "../assets/brandData";
import styles from "../styles/footer.module.css";

const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <p className="eyebrow">Luxury atelier</p>
          <h2>{brandName}</h2>
          <p>
            We design luxury girls wear with in-house embroidery, premium fabric sourcing,
            and finish-focused production inside our own facility.
          </p>
          <div className={styles.footerPills}>
            <span>In-house embroidery</span>
            <span>Premium finishing</span>
            <span>WhatsApp support</span>
          </div>
        </div>

        <div>
          <h3>Quick Links</h3>
          <div className={styles.linkGroup}>
            {quickLinks.map((item) => (
              <Link key={item.label} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>Concierge</h3>
          <div className={styles.linkGroup}>
            <a href={`mailto:${brandEmail}`}>{brandEmail}</a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              WhatsApp inquiry
            </a>
            <span>Factory-owned production and embroidery line</span>
            <span>Private guidance for festive orders and occasion looks</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>Luxury craftsmanship for every special moment.</span>
        <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
