import styles from "../styles/pages.module.css";

const StatsCard = ({ label, value }) => (
  <article className={`${styles.statCard} luxury-card`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
);

export default StatsCard;

