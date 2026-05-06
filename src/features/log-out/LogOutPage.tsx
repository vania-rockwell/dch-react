import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";

export default function LogOutPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("logOut.title")}
      description={t("logOut.description")}
    >
      <p>{t("logOut.body")}</p>
    </PageSection>
  );
}
