import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
};

function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const classes = `${variantClassMap[variant]} ${className}`.trim();

  return (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}

export default Button;
