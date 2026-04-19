type StatusPillProps = {
  text: string;
};

function StatusPill({ text }: StatusPillProps) {
  return <span className={`status-pill status-${text.toLowerCase().replace(/\s+/g, "-")}`}>{text}</span>;
}

export default StatusPill;
