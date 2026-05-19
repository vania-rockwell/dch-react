import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";
import { Button } from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import { useTheme } from "../../ThemeProvider";
import i18n from "../../locales/i18n";
import "./ApplicationPage.scss";

export default function ApplicationPage() {
  const { t: tPages } = useTranslation("pages");
  const { t: tCommon } = useTranslation("common");
  const { theme, mode, setTheme, setMode } = useTheme();

  const themeOptions = [
    { value: "kalypso", label: "Kalypso" },
    { value: "thermofisher", label: "Thermofisher" },
  ];

  const languageOptions = [
    { value: "en", label: tCommon("languageOption.en") },
    { value: "es", label: tCommon("languageOption.es") },
    { value: "it", label: tCommon("languageOption.it") },
  ];

  return (
    <PageSection
      title={tPages("application.title")}
      description={tPages("application.description")}
    >
      <div className="application-settings">
        <label className="application-settings__field" htmlFor="application-language-select">
          {tCommon("fields.language")}
          <Select
            id="application-language-select"
            size="sm"
            value={i18n.language}
            options={languageOptions}
            onChange={(event) => {
              void i18n.changeLanguage(event.target.value);
            }}
          />
        </label>

        <label className="application-settings__field" htmlFor="application-theme-select">
          {tCommon("fields.theme")}
          <Select
            id="application-theme-select"
            size="sm"
            value={theme}
            options={themeOptions}
            onChange={(event) => setTheme(event.target.value)}
          />
        </label>

        <Button
          variant="white"
          size="sm"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          aria-label={tCommon("aria.toggleColorMode")}
        >
          {mode === "light"
            ? tCommon("actions.darkMode")
            : tCommon("actions.lightMode")}
        </Button>
      </div>
    </PageSection>
  );
}
