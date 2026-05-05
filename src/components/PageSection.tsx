type PageSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <>
      <div className="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <section className="page-content">{children}</section>
    </>
  );
}
