import React from "react";
import "./Spinner.scss";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

const sizeMap = {
  sm: "spinner--sm",
  md: "spinner--md",
  lg: "spinner--lg",
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", className = "", "aria-label": ariaLabel = "Loading..." }, ref) => {
    return (
      <div
        ref={ref}
        className={`spinner ${sizeMap[size]} ${className}`.trim()}
        aria-label={ariaLabel}
        role="status"
      >
        <span className="spinner__circle" />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
