import type { ReactNode } from "react";
import "./PageSection.scss";

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function PageSection({
  title,
  description,
  children,
}: PageSectionProps) {
  return (
    <section className="page-section">
      <header className="page-section__header">
        <h1>{title}</h1>
        {description !== undefined && <p>{description}</p>}
      </header>
      <div>{children}</div>
    </section>
  );
}
