import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en/translation.json";
import trTranslation from "../locales/tr/translation.json";

const LANGUAGE_STORAGE_KEY = "labsoy-language";
const SUPPORTED_LANGUAGES = ["en", "tr"];

const normalizeLanguage = (value) => {
  if (!value || typeof value !== "string") {
    return "en";
  }

  const normalized = value.toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : "en";
};

const detectLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage) {
    return normalizeLanguage(savedLanguage);
  }

  return normalizeLanguage(window.navigator.language);
};

const resources = {
  en: { translation: enTranslation },
  tr: { translation: trTranslation }
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: "translation",
  interpolation: {
    escapeValue: false
  }
});

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
  }
});

export { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, normalizeLanguage };
export default i18n;
