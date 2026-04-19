import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", ...props }: InputProps) {
  const classes = ["input", className].filter(Boolean).join(" ");
  return <input {...props} className={classes} />;
}

export default Input;
