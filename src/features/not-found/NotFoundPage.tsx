import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function NotFoundPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("notFound.title")}
      description={t("notFound.description")}
    >
      <p>{t("notFound.body")}</p>
    </PageSection>
  );
}
