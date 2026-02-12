import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          description: "This is a multi-language app",
        },
      },
      hi: {
        translation: {
          welcome: "स्वागत है",
          description: "यह एक बहुभाषी ऐप है",
        },
      },
      bn: {
        translation: {
          welcome: "স্বাগতম",
          description: "এটি একটি বহু-ভাষার অ্যাপ",
        },
      },
    },
  });

export default i18n;
