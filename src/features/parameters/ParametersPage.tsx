import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";
import "./ParametersPage.scss";


export default function ParametersPage() {
  const { t } = useTranslation("pages");

  return (
    <PageSection
      title={t("parameters.title")}
      description={t("parameters.description")}
    >
      <p>{t("parameters.body")}</p>
    </PageSection>
  );
}
