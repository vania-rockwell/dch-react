import React from "react";
import "./Button.scss";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant: 'primary', 'secondary', 'danger', 'success', 'warning', 'info'
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size: 'sm', 'md', 'lg'
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Make button full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button content
   */
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  danger: "btn--danger",
  success: "btn--success",
  warning: "btn--warning",
  info: "btn--info",
  ghost: "btn--ghost",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

/**
 * Reusable Button component with support for multiple variants and sizes
 *
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 *
 * @example
 * // With variant and size
 * <Button variant="danger" size="lg">Delete</Button>
 *
 * @example
 * // With click handler
 * <Button onClick={() => console.log('clicked')}>Submit</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      fullWidth = false,
      children,
      className = "",
      type = "button",
      ...rest
    },
    ref
  ) => {
    const baseClasses = "btn";
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const fullWidthClass = fullWidth ? "btn--full-width" : "";

    const classes = [baseClasses, variantClass, sizeClass, fullWidthClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
