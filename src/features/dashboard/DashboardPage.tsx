import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function DashboardPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("dashboard.title")}
      description={t("dashboard.description")}
    >
      <p>{t("dashboard.body")}</p>
    </PageSection>
  );
}
