type MetricCardProps = {
  label: string;
  value: string | number;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="metric-card" aria-label={label}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default MetricCard;
