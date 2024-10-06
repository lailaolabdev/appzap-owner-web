import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./i18n/en_US.json"),
    },
    la: {
      translation: require("./i18n/en_LA.json"),
    },
    km: {
      translation: require("./i18n/en_KM.json"),
    },
  },
  lng: "la",
  fallbackLng: "la",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
