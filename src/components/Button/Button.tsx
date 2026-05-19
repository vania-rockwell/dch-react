import React from "react";
import type { LucideIcon } from "lucide-react";
import "./Button.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "white"
  | "black"
  | "gray";
export type ButtonSize = "sm" | "md" | "lg";
type ButtonIconPosition = "start" | "end";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant: 'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'white'
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
   * Lucide icon component to render alongside the label.
   */
  icon?: LucideIcon;

  /**
   * Position of the icon relative to the label.
   * @default 'start'
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Button content
   */
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  success: "btn--success",
  danger: "btn--danger",
  warning: "btn--warning",
  info: "btn--info",
  blue: "btn--blue",
  indigo: "btn--indigo",
  purple: "btn--purple",
  pink: "btn--pink",
  red: "btn--red",
  orange: "btn--orange",
  yellow: "btn--yellow",
  green: "btn--green",
  teal: "btn--teal",
  cyan: "btn--cyan",
  white: "btn--white",
  black: "btn--black",
  gray: "btn--gray",
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
const iconSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      fullWidth = false,
      icon: Icon,
      iconPosition = "start",
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

    const iconNode = Icon ? (
      <Icon size={iconSizeMap[size]} aria-hidden="true" />
    ) : null;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {iconPosition === "start" && iconNode}
        {children}
        {iconPosition === "end" && iconNode}
      </button>
    );
  }
);

Button.displayName = "Button";
