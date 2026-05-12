import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function ParametersGroupsPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("parametersGroups.title")}
      description={t("parametersGroups.description")}
    >
      <p>{t("parametersGroups.body")}</p>
    </PageSection>
  );
}
