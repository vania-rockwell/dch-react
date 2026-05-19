import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import "./Modal.scss";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const MODAL_TRANSITION_MS = 180;

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  size?: ModalSize;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  size = "md",
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frameId = window.requestAnimationFrame(() => setIsVisible(true));

      return () => window.cancelAnimationFrame(frameId);
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => setShouldRender(false), MODAL_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      data-state={isVisible ? "open" : "closed"}
      role="presentation"
      onClick={onClose}
    >
      <section
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            <X size={16}/>
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {actions ? <footer className="modal__footer">{actions}</footer> : null}
      </section>
    </div>
  );
}
