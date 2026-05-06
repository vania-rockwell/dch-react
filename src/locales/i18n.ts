import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./en/common.json";
import layoutEn from "./en/layout.json";
import pagesEn from "./en/pages.json";
import commonEs from "./es/common.json";
import layoutEs from "./es/layout.json";
import pagesEs from "./es/pages.json";

export const LOCALE_STORAGE_KEY = "dch.locale";

function getInitialLanguage(): string {
  if (typeof window === "undefined") {
    return "en";
  }
  return window.localStorage.getItem(LOCALE_STORAGE_KEY) ?? "en";
}

function syncDocumentFromI18n(): void {
  document.documentElement.lang = i18n.language;
  document.title = i18n.t("brand.appName", { ns: "layout" });
}

const resources = {
  en: { common: commonEn, layout: layoutEn, pages: pagesEn },
  es: { common: commonEs, layout: layoutEs, pages: pagesEs },
};

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  }
  syncDocumentFromI18n();
});

i18n.use(initReactI18next).init(
  {
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "es",
    defaultNS: "common",
    ns: ["common", "layout", "pages"],
    interpolation: { escapeValue: false },
  },
  syncDocumentFromI18n,
);

export default i18n;
