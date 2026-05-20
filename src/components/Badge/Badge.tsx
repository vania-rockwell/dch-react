import React from "react";
import "./Badge.scss";

type BadgeColor =
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

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Color variant applied to the badge.
   * @default "primary"
   */
  color?: BadgeColor;

  /**
   * Size variant applied to the badge.
   * @default "sm"
   */
  size?: BadgeSize;

  /**
   * Badge content.
   */
  children: React.ReactNode;
}

const colorStyles: Record<BadgeColor, string> = {
  primary: "badge--primary",
  secondary: "badge--secondary",
  success: "badge--success",
  danger: "badge--danger",
  warning: "badge--warning",
  info: "badge--info",
  blue: "badge--blue",
  indigo: "badge--indigo",
  purple: "badge--purple",
  pink: "badge--pink",
  red: "badge--red",
  orange: "badge--orange",
  yellow: "badge--yellow",
  green: "badge--green",
  teal: "badge--teal",
  cyan: "badge--cyan",
  white: "badge--white",
  black: "badge--black",
  gray: "badge--gray",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "badge--sm",
  md: "badge--md",
  lg: "badge--lg",
};

/**
 * Renders a compact status label with theme-aware color variants.
 * @param props Badge visual options and native span props.
 * @returns A reusable badge element.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    color = "primary", 
    size = "sm", 
    children, 
    className = "", 
    ...rest 
  }, ref) => {
    const classes = ["badge", colorStyles[color], sizeStyles[size], className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export type { BadgeColor, BadgeProps };
export default Badge;
