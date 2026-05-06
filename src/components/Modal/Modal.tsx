import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "./Modal.scss";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  actions,
}: ModalProps) {
  const { t } = useTranslation("common");

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            {t("actions.close")}
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {actions ? <footer className="modal__footer">{actions}</footer> : null}
      </section>
    </div>
  );
}
