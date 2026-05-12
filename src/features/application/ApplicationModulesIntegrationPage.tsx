import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function ApplicationModulesIntegrationPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("modulesIntegration.title")}
      description={t("modulesIntegration.description")}
    >
      <p>{t("modulesIntegration.body")}</p>
    </PageSection>
  );
}
