import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function ApplicationModulesReportingPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("modulesReporting.title")}
      description={t("modulesReporting.description")}
    >
      <p>{t("modulesReporting.body")}</p>
    </PageSection>
  );
}
