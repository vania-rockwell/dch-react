import PageSection from "../components/PageSection/PageSection";

export default function NotFoundPage() {
  return (
    <PageSection
      title="Page Not Found"
      description="The page you were looking for does not exist."
    >
      <p>
        Use the left navigation panel to return to a valid section.
      </p>
    </PageSection>
  );
}
