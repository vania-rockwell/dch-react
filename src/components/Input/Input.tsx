import React from "react";
import type { LucideIcon } from "lucide-react";
import Badge from "@/components/Badge/Badge";
import type { BadgeColor } from "@/components/Badge/Badge";
import "./Input.scss";

export type InputSize = "sm" | "md" | "lg";
export type InputLabelPosition = "top" | "left" | "right" | "floating";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Input size: 'sm', 'md', 'lg'
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Label text. Required when using labelPosition.
   */
  label?: string;

  /**
   * Position of the label relative to the input.
   * @default 'top'
   */
  labelPosition?: InputLabelPosition;

  /**
   * Make input full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Helper text rendered below the input.
   */
  helperText?: string;

  /**
   * Error message. When set, applies error styling.
   */
  error?: string;

  /**
   * Text to display inside a badge next to the label when the input is `required`.
   * Only shown when both `required` and `label` are set.
   */
  requiredLabel?: string;

  /**
   * Color of the required badge.
   * @default 'success'
   */
  requiredBadgeColor?: BadgeColor;

  /**
   * Lucide icon rendered at the start (left) of the input.
   */
  startIcon?: LucideIcon;

  /**
   * Lucide icon rendered at the end (right) of the input.
   */
  endIcon?: LucideIcon;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "input--sm",
  md: "input--md",
  lg: "input--lg",
};

const labelPositionStyles: Record<InputLabelPosition, string> = {
  top: "input-wrapper--label-top",
  left: "input-wrapper--label-left",
  right: "input-wrapper--label-right",
  floating: "input-wrapper--label-floating",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      label,
      labelPosition = "top",
      fullWidth = false,
      helperText,
      error,
      requiredLabel,
      requiredBadgeColor = "success",
      startIcon: StartIcon,
      endIcon: EndIcon,
      className = "",
      id,
      placeholder,
      required,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isFloating = labelPosition === "floating";

    const wrapperClasses = [
      "input-wrapper",
      label ? labelPositionStyles[labelPosition] : "",
      fullWidth ? "input-wrapper--full-width" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const fieldClasses = [
      "input-field",
      StartIcon ? "input-field--has-start-icon" : "",
      EndIcon ? "input-field--has-end-icon" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = [
      "input",
      sizeStyles[size],
      error ? "input--error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const showRequiredBadge = required && label && requiredLabel;

    const labelEl = label && (
      <label className="input-label" htmlFor={inputId}>
        <span className="input-label__text">{label}</span>
        {showRequiredBadge && (
          <Badge color={requiredBadgeColor}>{requiredLabel}</Badge>
        )}
      </label>
    );

    return (
      <div className={wrapperClasses}>
        {label && !isFloating && labelPosition !== "right" && labelEl}

        <div className={fieldClasses}>
          {StartIcon && (
            <span className="input-icon input-icon--start" aria-hidden="true">
              <StartIcon />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            placeholder={isFloating ? " " : placeholder}
            required={required}
            {...rest}
          />

          {isFloating && label && (
            <label className="input-label input-label--floating" htmlFor={inputId}>
              <span className="input-label__text">{label}</span>
              {showRequiredBadge && (
                <Badge color={requiredBadgeColor}>{requiredLabel}</Badge>
              )}
            </label>
          )}

          {EndIcon && (
            <span className="input-icon input-icon--end" aria-hidden="true">
              <EndIcon />
            </span>
          )}
        </div>

        {label && !isFloating && labelPosition === "right" && labelEl}

        {(helperText || error) && (
          <span className={error ? "input-helper input-helper--error" : "input-helper"}>
            {error ?? helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
