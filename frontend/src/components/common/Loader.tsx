interface LoaderProps {
  label?: string;
}

function Loader({ label = "Loading..." }: LoaderProps) {
  return <p aria-live="polite">{label}</p>;
}

export default Loader;
