// import { useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Select, { SingleValue } from "react-select";
// import { useDispatch } from "react-redux";
// import actions from "../../redux/actions";

// type Language = { value: string; label: string; flagUrl: string };

// const GOOGLE_API_KEY = import.meta.env.VITE_PLACE_API;

// const languages: Language[] = [
//   { value: "en", label: "English", flagUrl: "/flags/uk.png" },
//   { value: "fr", label: "Français", flagUrl: "/flags/fr.png" },
//   { value: "es", label: "Español", flagUrl: "/flags/es.png" },
// ];

// const translationCache = new Map<string, Map<string, string>>();
// let translating = false;
// let lastRun = 0;

// async function fetchTranslations(originals: string[], targetLang: string) {
//   const result = new Map<string, string>();
//   const toTranslate: string[] = [];

//   for (const o of originals) {
//     const perLang = translationCache.get(o);
//     const hit = perLang?.get(targetLang);
//     if (hit) result.set(o, hit);
//     else toTranslate.push(o);
//   }

//   if (!toTranslate.length) return result;

//   const unique = Array.from(new Set(toTranslate));
//   try {
//     const res = await fetch(
//       `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           q: unique,
//           source: "en",
//           target: targetLang,
//           format: "text",
//         }),
//       }
//     );

//     const data = await res.json();
//     const translated = (data?.data?.translations || []) as Array<{
//       translatedText: string;
//     }>;

//     translated.forEach((t, i) => {
//       const orig = unique[i];
//       if (!translationCache.has(orig)) translationCache.set(orig, new Map());
//       translationCache.get(orig)!.set(targetLang, t.translatedText);
//       result.set(orig, t.translatedText);
//     });
//   } catch (e) {
//     console.error("Google Translation Error:", e);
//   }

//   return result;
// }

// async function applyLanguage(targetLang: string) {
//   const now = Date.now();
//   if (translating || now - lastRun < 500) return;
//   translating = true;
//   lastRun = now;

//   try {
//     const textNodes: Node[] = [];
//     const walker = document.createTreeWalker(
//       document.body,
//       NodeFilter.SHOW_TEXT,
//       {
//         acceptNode(node) {
//           const parent = (node as any).parentElement as HTMLElement | null;
//           const text = node.nodeValue?.trim();
//           if (!text || text.length < 2 || !parent)
//             return NodeFilter.FILTER_REJECT;
//           const tag = parent.tagName?.toLowerCase();
//           if (["script", "style", "noscript"].includes(tag))
//             return NodeFilter.FILTER_REJECT;
//           return NodeFilter.FILTER_ACCEPT;
//         },
//       }
//     );

//     while (walker.nextNode()) textNodes.push(walker.currentNode);
//     if (!textNodes.length) return;

//     textNodes.forEach((node) => {
//       const el = (node as any).parentElement as HTMLElement | null;
//       if (!el) return;
//       if (!el.dataset.original) el.dataset.original = node.nodeValue || "";
//     });

//     if (targetLang === "en") {
//       textNodes.forEach((node) => {
//         const el = (node as any).parentElement as HTMLElement | null;
//         if (!el) return;
//         const original = el.dataset.original;
//         if (original != null) node.nodeValue = original;
//       });
//       return;
//     }

//     const originals: string[] = textNodes.map((n) => {
//       const el = (n as any).parentElement as HTMLElement | null;
//       return el?.dataset.original || n.nodeValue || "";
//     });

//     const map = await fetchTranslations(originals, targetLang);
//     textNodes.forEach((node, i) => {
//       const el = (node as any).parentElement as HTMLElement | null;
//       if (!el) return;
//       const original = originals[i];
//       const translated = map.get(original);
//       if (!translated) return;
//       node.nodeValue = translated;
//       el.dataset.translatedLang = targetLang;
//     });
//   } finally {
//     translating = false;
//   }
// }

// export default function GoogleAutoTranslate() {
//   const dispatch = useDispatch();
//   const [selectedLang, setSelectedLang] = useState<Language | null>(null);
//   const currentLang = useRef("en");
//   const location = useLocation();

//   const fadeContent = (show: boolean) => {
//     const appContent = document.getElementById("app-content");
//     if (appContent) {
//       appContent.style.transition = "opacity 0.3s ease";
//       appContent.style.opacity = show ? "1" : "0";
//       appContent.style.pointerEvents = show ? "auto" : "none";
//     }
//   };

//   const translateWithLoader = async (lang: string) => {
//     dispatch({ type: actions.INIT_LOADER, payload: { loader: true } });
//     fadeContent(false);

//     await new Promise((resolve) => requestAnimationFrame(resolve));
//     try {
//       await applyLanguage(lang);
//       await new Promise((res) => setTimeout(res, 1000));
//     } finally {
//       fadeContent(true);
//       dispatch({ type: actions.INIT_LOADER, payload: { loader: false } });
//     }
//   };

//   useEffect(() => {
//     const saved = localStorage.getItem("selectedLanguage") || "en";
//     const matched = languages.find((l) => l.value === saved) || languages[0];
//     setSelectedLang(matched);
//     currentLang.current = matched.value;
//     translateWithLoader(matched.value);
//   }, []);

//   useEffect(() => {
//     const lang = currentLang.current;
//     if (lang !== "en") {
//       dispatch({ type: actions.INIT_LOADER, payload: { loader: true } });
//       fadeContent(false);
//       const delay = setTimeout(() => translateWithLoader(lang), 400);
//       return () => clearTimeout(delay);
//     }
//   }, [location.pathname]);

//   const handleChange = async (lang: SingleValue<Language>) => {
//     if (!lang) return;
//     localStorage.setItem("selectedLanguage", lang.value);
//     currentLang.current = lang.value;
//     setSelectedLang(lang);
//     await translateWithLoader(lang.value);
//   };

//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       const lang = currentLang.current;
//       if (lang !== "en") applyLanguage(lang);
//     });
//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//       characterData: false,
//     });
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     const saved = localStorage.getItem("selectedLanguage");
//     if (saved) {
//       const match = languages.find((l) => l.value === saved);
//       if (match && match.value !== selectedLang?.value) {
//         setSelectedLang(match);
//       }
//     }
//   }, [location.pathname]);

//   return (
//     <div className="w-full space-y-4">
//       <Select
//         options={languages}
//         value={selectedLang}
//         onChange={handleChange}
//         placeholder="Select language"
//         classNamePrefix="lang"
//         isSearchable={false}
//         menuPlacement="top"
//         menuPosition="absolute"
//         formatOptionLabel={({ label, flagUrl }) => (
//           <div className="flex items-center space-x-2">
//             <img src={flagUrl} alt={label} className="w-5 h-5" />
//             <span>{label}</span>
//           </div>
//         )}
//       />
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import { useDispatch } from "react-redux";
import actions from "../../redux/actions";

type Language = { value: string; label: string; flagUrl: string };

const GOOGLE_API_KEY = import.meta.env.VITE_PLACE_API;

const languages: Language[] = [
  { value: "fr", label: "Français", flagUrl: "/flags/fr.png" },
  { value: "en", label: "English", flagUrl: "/flags/uk.png" },
  { value: "es", label: "Español", flagUrl: "/flags/es.png" },
];

const translationCache = new Map<string, Map<string, string>>();
let translating = false;
let lastRun = 0;

async function fetchTranslations(originals: string[], targetLang: string) {
  const result = new Map<string, string>();
  const toTranslate: string[] = [];

  for (const o of originals) {
    const perLang = translationCache.get(o);
    const hit = perLang?.get(targetLang);
    if (hit) result.set(o, hit);
    else toTranslate.push(o);
  }

  if (!toTranslate.length) return result;

  const unique = Array.from(new Set(toTranslate));
  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: unique,
          source: "en",
          target: targetLang,
          format: "text",
        }),
      }
    );

    const data = await res.json();
    const translated = (data?.data?.translations || []) as Array<{
      translatedText: string;
    }>;

    translated.forEach((t, i) => {
      const orig = unique[i];
      if (!translationCache.has(orig)) translationCache.set(orig, new Map());
      translationCache.get(orig)!.set(targetLang, t.translatedText);
      result.set(orig, t.translatedText);
    });
  } catch (e) {
    console.error("Google Translation Error:", e);
  }

  return result;
}

async function applyLanguage(targetLang: string) {
  const now = Date.now();
  if (translating || now - lastRun < 500) return;
  translating = true;
  lastRun = now;

  try {
    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = (node as any).parentElement as HTMLElement | null;
          const text = node.nodeValue?.trim();
          if (!text || text.length < 2 || !parent)
            return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName?.toLowerCase();

          // 🚫 Skip tags that should never be translated
          if (
            [
              "script",
              "style",
              "noscript",
              "input",
              "textarea",
              "select",
              "option",
              "svg",
              "path",
              "title",
              "meta",
              "head",
            ].includes(tag)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // 🚫 Skip <head> and system/meta tags
          if (parent.closest("head")) {
            return NodeFilter.FILTER_REJECT;
          }

          // 🚫 Skip all select-related wrappers (React-Select or CustomSelect)
          if (
            parent.closest(".react-select") ||
            parent.closest(".react-select__control") ||
            parent.closest(".react-select__menu") ||
            parent.closest(".react-select__value-container") ||
            parent.closest(".react-select__input-container") ||
            parent.closest(".react-select__single-value") ||
            parent.closest(".react-select__placeholder") ||
            parent.closest(".custom-select-container") ||
            parent.closest(".custom-select") ||
            parent.closest("[data-no-translate]")
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip ENUM-like constants or short system words
          const enums = [
            "pending",
            "processing",
            "paid",
            "rejected",
            "active",
            "inactive",
            "canceled",
            "cancelled",
            "approved",
            "declined",
            "success",
            "failed",
            "true",
            "false",
            "usd",
            "eur",
            "inr",
          ];
          if (enums.includes(text.toLowerCase()))
            return NodeFilter.FILTER_REJECT;

          // 🚫 Skip all-uppercase short codes or numeric values
          if (/^[A-Z]{2,}$/.test(text) || /^[0-9]+$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    while (walker.nextNode()) textNodes.push(walker.currentNode);
    if (!textNodes.length) return;

    // Store original text for reset
    textNodes.forEach((node) => {
      const el = (node as any).parentElement as HTMLElement | null;
      if (!el) return;
      if (!el.dataset.original) el.dataset.original = node.nodeValue || "";
    });

    // Reset to English
    if (targetLang === "en") {
      textNodes.forEach((node) => {
        const el = (node as any).parentElement as HTMLElement | null;
        if (!el) return;
        const original = el.dataset.original;
        if (original != null) node.nodeValue = original;
      });
      return;
    }

    const originals = textNodes.map((n) => {
      const el = (n as any).parentElement as HTMLElement | null;
      return el?.dataset.original || n.nodeValue || "";
    });

    const map = await fetchTranslations(originals, targetLang);
    textNodes.forEach((node, i) => {
      const el = (node as any).parentElement as HTMLElement | null;
      if (!el) return;
      const original = originals[i];
      const translated = map.get(original);
      if (!translated) return;
      node.nodeValue = translated;
      el.dataset.translatedLang = targetLang;
    });
  } finally {
    translating = false;
  }
}

export default function GoogleAutoTranslate() {
  const dispatch = useDispatch();
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const currentLang = useRef("fr");
  const location = useLocation();

  const fadeContent = (show: boolean) => {
    const appContent = document.getElementById("app-content");
    if (appContent) {
      appContent.style.transition = "opacity 0.3s ease";
      appContent.style.opacity = show ? "1" : "0";
      appContent.style.pointerEvents = show ? "auto" : "none";
    }
  };

  const translateWithLoader = async (lang: string) => {
    dispatch({ type: actions.INIT_LOADER, payload: { loader: true } });
    fadeContent(false);

    await new Promise((resolve) => requestAnimationFrame(resolve));
    try {
      await applyLanguage(lang);
      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      fadeContent(true);
      dispatch({ type: actions.INIT_LOADER, payload: { loader: false } });
    }
  };

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("selectedLanguage") || "fr";
    const matched = languages.find((l) => l.value === saved) || languages[0];
    setSelectedLang(matched);
    currentLang.current = matched.value;
    translateWithLoader(matched.value);
  }, []);

  // Reapply translation on route change
  useEffect(() => {
    const lang = currentLang.current;
    if (lang !== "en") {
      dispatch({ type: actions.INIT_LOADER, payload: { loader: true } });
      fadeContent(false);
      const delay = setTimeout(() => translateWithLoader(lang), 400);
      return () => clearTimeout(delay);
    }
  }, [location.pathname]);

  const handleChange = async (lang: SingleValue<Language>) => {
    if (!lang) return;
    localStorage.setItem("selectedLanguage", lang.value);
    currentLang.current = lang.value;
    setSelectedLang(lang);
    await translateWithLoader(lang.value);
  };

  // Observe new DOM nodes but skip select areas
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const lang = currentLang.current;
      if (lang === "en") return;

      const shouldReapply = mutations.some((mutation) => {
        const target = mutation.target as HTMLElement;
        if (!target) return false;
        if (target.closest("head")) return false;
        if (["meta", "title"].includes(target.tagName?.toLowerCase()))
          return false;
        return (
          !target.closest(".react-select") &&
          !target.closest(".custom-select-container") &&
          !target.closest("input") &&
          !target.closest("textarea") &&
          !target.closest("select")
        );
      });

      if (shouldReapply) {
        requestAnimationFrame(() => applyLanguage(lang));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("selectedLanguage");
    if (saved) {
      const match = languages.find((l) => l.value === saved);
      if (match && match.value !== selectedLang?.value) {
        setSelectedLang(match);
      }
    }
  }, [location.pathname]);

  return (
    <div className="w-full space-y-4" data-no-translate>
      <Select
        options={languages}
        value={selectedLang}
        onChange={handleChange}
        placeholder="Sélectionner la langue"
        classNamePrefix="lang"
        isSearchable={false}
        menuPlacement="top"
        menuPosition="absolute"
        formatOptionLabel={({ label, flagUrl }) => (
          <div className="flex items-center space-x-2">
            <img src={flagUrl} alt={label} className="w-5 h-5" />
            <span>{label}</span>
          </div>
        )}
      />
    </div>
  );
}
