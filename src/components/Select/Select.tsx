import React from "react";
import "./Select.scss";

type SelectSize = "sm" | "md" | "lg";

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  size?: SelectSize;
  fullWidth?: boolean;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "select--sm",
  md: "select--md",
  lg: "select--lg",
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, size = "md", fullWidth = false, className = "", ...rest }, ref) => {
    const classes = [
      "select",
      sizeStyles[size],
      fullWidth ? "select--full-width" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <select ref={ref} className={classes} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
