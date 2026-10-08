import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  hasLocale,
  localeCookie,
  locales,
  matchLocale,
} from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return;

  // A visitor's explicit choice (language switcher) wins over the browser language.
  const saved = request.cookies.get(localeCookie)?.value;
  const locale =
    saved && hasLocale(saved)
      ? saved
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  // The target depends on these headers, so shared caches must not reuse one redirect for everyone.
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Skip Next internals and any file with an extension (images, favicon, sitemap.xml, robots.txt...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
