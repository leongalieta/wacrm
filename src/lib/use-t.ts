"use client";

import { useLocale } from "./language-provider";
import ptBR from "./messages/pt-BR";
import en from "./messages/en";

const messages: Record<string, Record<string, unknown>> = {
  "pt-BR": ptBR,
  en,
};

export function useT(namespace: string) {
  const locale = useLocale() as keyof typeof messages;
  const ns = (messages[locale] || messages["pt-BR"]) as Record<string, unknown>;
  const nsObj = ns[namespace] as Record<string, string> | undefined;
  const scope = nsObj ?? ns as Record<string, unknown>;

  function t(key: string, params?: Record<string, string | number>): string {
    const raw = (scope as Record<string, unknown>)[key];
    const value = typeof raw === "string" ? raw : key;
    if (params && typeof value === "string") {
      let result = value;
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    }
    return value;
  }

  return t;
}
