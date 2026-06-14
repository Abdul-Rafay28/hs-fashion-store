const LoadingBlock = ({ label = "Loading..." }) => (
  <div className="state-card">
    <div className="loading-dot-grid" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <p>{label}</p>
  </div>
);

export default LoadingBlock;

