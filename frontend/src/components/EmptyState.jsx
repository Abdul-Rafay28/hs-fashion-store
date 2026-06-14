const EmptyState = ({
  title = "Nothing to show yet",
  description = "Once your products are live, they will appear here.",
  action = null,
}) => (
  <div className="state-card">
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

export default EmptyState;

