"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { localeCookie, locales, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";
import { MenuIcon } from "./icons";

const linkOrder = [
  ["#servicios", "services"],
  ["#cotizar-datos", "needs"],
  ["#proceso", "process"],
  ["#nosotros", "about"],
  ["#contacto", "contact"],
] as const;

function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function LanguageSwitcher({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const router = useRouter();

  const switchTo = (next: Locale) => {
    rememberLocale(next);
    // Keep the visitor on the same section.
    router.push(`/${next}${window.location.hash}`);
  };

  return (
    <div role="group" aria-label={t.languageAria} className="flex items-center text-sm font-semibold">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="px-0.5 text-[#8fa5c2]">|</span>}
          <a
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (l !== lang) switchTo(l);
            }}
            className={`inline-flex min-h-11 min-w-9 items-center justify-center uppercase ${l === lang ? "text-green" : "text-white hover:text-green-light"}`}
          >
            {l}
          </a>
        </span>
      ))}
    </div>
  );
}

export function HeaderClient({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2f5078] bg-navy text-white">
      <div className="wrap flex h-[68px] items-center justify-between gap-4 sm:h-[84px]">
        <a href="#" aria-label={t.homeAria} className="shrink-0">
          <Logo className="block h-11 w-auto text-green" />
        </a>

        <nav aria-label={t.mainAria} className="hidden items-center gap-7 text-[15px] font-medium xl:flex">
          {linkOrder.map(([href, key]) => (
            <a key={key} href={href} className="hover:text-green-light">
              {t[key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher t={t} lang={lang} />
          <a href="#cotizar" className="btn btn-primary hidden px-[22px] py-[13px] text-[15px] xl:inline-block">
            {t.quote}
          </a>
          <button
            type="button"
            aria-label={t.menuAria}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[2px] border-[1.5px] border-[#8fa5c2] bg-transparent px-4 text-[15px] font-semibold text-white xl:hidden"
          >
            <MenuIcon />
            <span>{t.menu}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label={t.mobileAria} className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-[#3a5a84] sm:max-h-[calc(100dvh-84px)] xl:hidden">
          <div className="wrap flex flex-col pb-5 pt-1.5 text-base font-semibold">
            {linkOrder.map(([href, key]) => (
              <a
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-[#2f5078] py-[15px]"
              >
                {t[key]}
              </a>
            ))}
            <a
              href="#cotizar"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-[18px] p-[15px]"
            >
              {t.quote}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
