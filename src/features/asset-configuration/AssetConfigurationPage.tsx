import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function AssetConfigurationPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("assetConfiguration.title")}
      description={t("assetConfiguration.description")}
    >
      <p>{t("assetConfiguration.body")}</p>
    </PageSection>
  );
}
