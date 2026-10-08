import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { contactEmail, siteName, siteUrl } from "@/lib/site";

export async function JsonLd() {
  const [{ meta }, lang] = await Promise.all([getDictionary(), getLocale()]);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "GBA Logistics, C.A.",
    alternateName: siteName,
    description: meta.description,
    url: `${siteUrl}/${lang}`,
    logo: `${siteUrl}/images/gba-logo.png`,
    image: `${siteUrl}/images/hero-containers.jpg`,
    email: contactEmail,
    taxID: "J-50138099-6",
    inLanguage: lang,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Caracas",
      addressCountry: "VE",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
