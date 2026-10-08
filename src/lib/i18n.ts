export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const localeCookie = "lang";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Picks the best supported locale from an `Accept-Language` header. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        q: q ? Number(q.trim().slice(2)) : 1,
      };
    })
    .filter((entry) => entry.base && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { base } of ranked) {
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}
