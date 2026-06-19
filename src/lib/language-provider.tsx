"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Locale = "pt-BR" | "en";

const LocaleContext = createContext<Locale>("pt-BR");

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt-BR");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "pt-BR" || stored === "en") {
      setLocale(stored);
    }
  }, []);

  const setLocaleAndPersist = (l: Locale) => {
    setLocale(l);
    localStorage.setItem("locale", l);
  };

  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
