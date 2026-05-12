import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function UserPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection title={t("user.title")} description={t("user.description")}>
      <p>{t("user.body")}</p>
    </PageSection>
  );
}
