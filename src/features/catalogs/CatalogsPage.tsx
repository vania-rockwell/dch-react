import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function CatalogsPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("catalogs.title")}
      description={t("catalogs.description")}
    >
      <p>{t("catalogs.body")}</p>
    </PageSection>
  );
}
