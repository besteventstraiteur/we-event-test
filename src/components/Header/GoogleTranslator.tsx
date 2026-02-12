import { useEffect, useState } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_PLACE_API;

export function useGoogleTranslator(text: string, targetLang: string) {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) return;

    const cacheKey = `${targetLang}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslated(cached);
      return;
    }

    const translate = async () => {
      try {
        if (targetLang === "en") return setTranslated(text);

        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              q: text,
              source: "en",
              target: targetLang,
              format: "text",
            }),
          }
        );

        const data = await res.json();
        const translatedText = data.data.translations[0].translatedText;
        setTranslated(translatedText);
        localStorage.setItem(cacheKey, translatedText);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslated(text);
      }
    };

    translate();
  }, [text, targetLang]);

  return translated;
}
