import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function ApplicationModulesPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("applicationModules.title")}
      description={t("applicationModules.description")}
    >
      <p>{t("applicationModules.body")}</p>
    </PageSection>
  );
}
