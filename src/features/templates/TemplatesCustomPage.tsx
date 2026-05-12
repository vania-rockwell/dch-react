import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function TemplatesCustomPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("templatesCustom.title")}
      description={t("templatesCustom.description")}
    >
      <p>{t("templatesCustom.body")}</p>
    </PageSection>
  );
}
