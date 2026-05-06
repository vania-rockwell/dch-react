import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function SecurityPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("security.title")}
      description={t("security.description")}
    >
      <p>{t("security.body")}</p>
    </PageSection>
  );
}
