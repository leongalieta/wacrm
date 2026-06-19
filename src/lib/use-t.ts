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
  const scope = (ns[namespace] || ns) as Record<string, string>;

  function t(key: string, params?: Record<string, string | number>): string {
    let value = scope[key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  return t;
}
