import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function SecurityPermissionsPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("securityPermissions.title")}
      description={t("securityPermissions.description")}
    >
      <p>{t("securityPermissions.body")}</p>
    </PageSection>
  );
}
