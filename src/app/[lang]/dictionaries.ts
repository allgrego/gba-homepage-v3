import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import type es from "./dictionaries/es.json";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof es;

// Compile-time guarantee that every locale has exactly the same keys as `es`.
type SameShape<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const _enMatchesEs: SameShape<typeof en, Dictionary> = true;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(): Promise<Dictionary> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
}

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}
