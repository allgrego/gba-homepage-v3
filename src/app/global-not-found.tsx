import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Logo } from "@/components/Logo";
import { locales } from "@/lib/i18n";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 | GBA Logistics",
};

// This page bypasses the [lang] layout and the dictionaries, so the copy is inline. An unmatched URL
// always starts with the locale (the proxy redirects locale-less paths), so a tiny script picks the
// language from the path before first paint. Without JS both languages are shown.
const pickLanguage = `(function(){var m=location.pathname.match(/^\\/(${locales.join("|")})(\\/|$)/);if(m){var d=document.documentElement;d.setAttribute("data-lang",m[1]);d.lang=m[1]}})()`;

export default function GlobalNotFound() {
  return (
    // suppressHydrationWarning: the script above changes lang / data-lang before React hydrates.
    <html lang="es" className={`${montserrat.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
        <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-5 py-16 text-center text-white">
          <Logo className="h-14 w-auto text-green" />
          <p className="mt-12 text-sm font-bold uppercase tracking-[0.18em] text-green-light">404</p>

          <section lang="es" className="nf-es flex flex-col items-center">
            <h1 className="mt-3 text-[32px] font-light leading-[1.1] sm:text-5xl">
              No encontramos esta página
            </h1>
            <p className="mt-5 max-w-[460px] text-lg font-light leading-[1.6] text-[#e3eaf3]">
              Es posible que el enlace esté mal escrito o que la página ya no exista.
            </p>
            <Link href="/es" className="btn btn-primary mt-8 px-7 py-4 text-base">
              Volver al inicio
            </Link>
          </section>

          <section lang="en" className="nf-en mt-12 flex flex-col items-center border-t border-[#3a5a84] pt-10">
            <h1 className="mt-3 text-[32px] font-light leading-[1.1] sm:text-5xl">
              We couldn&apos;t find this page
            </h1>
            <p className="mt-5 max-w-[460px] text-lg font-light leading-[1.6] text-[#e3eaf3]">
              The link may be mistyped, or the page may no longer exist.
            </p>
            <Link href="/en" className="btn btn-primary mt-8 px-7 py-4 text-base">
              Back to the homepage
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
