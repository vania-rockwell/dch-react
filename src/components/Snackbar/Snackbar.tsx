import { useEffect } from "react";
import "./Snackbar.scss";

type SnackbarVariant = "info" | "success" | "warning" | "danger";

type SnackbarProps = {
  open: boolean;
  message: string;
  variant?: SnackbarVariant;
  autoHideMs?: number;
  onClose: () => void;
};

export default function Snackbar({
  open,
  message,
  variant = "info",
  autoHideMs = 3000,
  onClose,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || autoHideMs <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(onClose, autoHideMs);
    return () => window.clearTimeout(timer);
  }, [open, autoHideMs, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={`snackbar snackbar--${variant}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="snackbar__close" onClick={onClose}>
        Dismiss
      </button>
    </div>
  );
}
