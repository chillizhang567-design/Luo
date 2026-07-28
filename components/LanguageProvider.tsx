"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

export type Locale = "en" | "zh";

/** Shape of a translation dictionary (inferred from en.json). */
export type Dict = typeof en;

const DICTS: Record<Locale, Dict> = { en, zh };

const STORAGE_KEY = "drift-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dict;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "zh") return saved;
  const nav = window.navigator?.language?.toLowerCase() ?? "";
  return nav.startsWith("zh") ? "zh" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Resolve the real initial locale after mount (client only).
  useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  // Keep <html lang> in sync for accessibility / CJK rendering.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "zh" ? "zh-CN" : "en-US";
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: DICTS[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
