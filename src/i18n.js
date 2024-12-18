import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Function to get the language from localStorage or fallback to 'la' (Lao)
const getInitialLanguage = () => {
  const storedLang = localStorage.getItem("language");
  return storedLang ? storedLang : "la"; // Default to Lao if not set
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./i18n/en_US.json"),
    },
    la: {
      translation: require("./i18n/en_LA.json"),
    },
    th: {
      translation: require("./i18n/en_TH.json"),
    },
    km: {
      translation: require("./i18n/en_KM.json"),
    },
  },
  lng: getInitialLanguage(), // Set the language from localStorage or fallback to Lao
  fallbackLng: "la",

  interpolation: {
    escapeValue: false, // React already escapes values by default
  },
});

// Update language in i18n and store it in localStorage
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng); // Store the language in localStorage
  window.location.reload(); // Reload the page to apply the language change
};

export default i18n;

// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";

// i18n.use(initReactI18next).init({
//   resources: {
//     en: {
//       translation: require("./i18n/en_US.json"),
//     },
//     la: {
//       translation: require("./i18n/en_LA.json"),
//     },
//     km: {
//       translation: require("./i18n/en_KM.json"),
//     },
//   },
//   lng: "la",
//   fallbackLng: "la",

//   interpolation: {
//     escapeValue: false,
//   },
// });

// export default i18n;
