import "server-only";

const flag = (name: string) => (process.env[name] ?? "").trim().toLowerCase();

/** Kill switch for the whole quote form (UI and Server Action). On unless explicitly turned off. */
export const isQuoteFormEnabled = () => !["0", "false", "no", "off"].includes(flag("QUOTE_FORM_ENABLED"));

/** Google Sheet logging is opt-in, so a half-configured Sheet can never affect the email. */
export const isSheetEnabled = () => ["1", "true", "yes", "on"].includes(flag("QUOTE_SHEET_ENABLED"));
