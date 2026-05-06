import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function TemplatesPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("templates.title")}
      description={t("templates.description")}
    >
      <p>{t("templates.body")}</p>
    </PageSection>
  );
}
