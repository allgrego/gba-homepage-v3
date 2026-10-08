import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { siteName, siteUrl } from "@/lib/site";
import { getDictionary } from "./dictionaries";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { meta } = await getDictionary();

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      type: "website",
      siteName,
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      locale: meta.ogLocale,
      alternateLocale: lang === "es" ? "en_US" : "es_VE",
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: siteName }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${montserrat.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
