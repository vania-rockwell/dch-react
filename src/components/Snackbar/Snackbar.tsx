import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./Snackbar.scss";

export type SnackbarVariant = "info" | "success" | "warning" | "danger";
export type SnackbarPosition = "top-right" | "bottom-right";

const SNACKBAR_TRANSITION_MS = 250;

type SnackbarProps = {
  open: boolean;
  message: string;
  variant?: SnackbarVariant;
  position?: SnackbarPosition;
  autoHideMs?: number;
  onClose: () => void;
};

export default function Snackbar({
  open,
  message,
  variant = "success",
  position = "top-right",
  autoHideMs = 3000,
  onClose,
}: SnackbarProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frameId = window.requestAnimationFrame(() => setIsVisible(true));

      return () => window.cancelAnimationFrame(frameId);
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => setShouldRender(false), SNACKBAR_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open || !isVisible || autoHideMs <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(onClose, autoHideMs);
    return () => window.clearTimeout(timer);
  }, [open, isVisible, autoHideMs, onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`snackbar snackbar--${variant} snackbar--${position}`}
      data-state={isVisible ? "open" : "closed"}
      role="status"
      aria-live="polite"
    >
      <span className="snackbar__message">{message}</span>
        <button type="button" className="snackbar__close" onClick={onClose}>
        <X size={16} />
      </button>
      {autoHideMs > 0 && isVisible && (
        <div
          className="snackbar__progress"
          style={{ animationDuration: `${autoHideMs}ms` }}
        />
      )}
    </div>
  );
}
