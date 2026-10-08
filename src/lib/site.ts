export const siteUrl = "https://gbalogistic.com";
const DEFAULT_CONTACT_EMAIL = "sales@gbalogistic.com";

/**
 * Public contact address shown on the site (top bar, contact section, mailto links, structured data).
 * Set NEXT_PUBLIC_CONTACT_EMAIL to change it. It is inlined at build time and is public by nature.
 * This is NOT where the quote form delivers: that inbox is QUOTE_TO_EMAIL (server only).
 */
const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
export const contactEmail =
  configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail)
    ? configuredEmail
    : DEFAULT_CONTACT_EMAIL;
export const siteName = "GBA Logistics";
