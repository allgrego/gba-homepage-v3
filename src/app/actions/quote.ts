"use server";

import { hasLocale } from "@/lib/i18n";
import {
  clientTypes,
  quoteModes,
  type ClientType,
  type QuoteMode,
  type QuoteState,
} from "@/lib/quote-types";
import { validateQuote } from "@/lib/quote-validation";
import { isQuoteFormEnabled, isSheetEnabled } from "@/lib/server/flags";
import { appendQuoteToSheet } from "@/lib/server/google-sheet";
import { sendQuoteEmail } from "@/lib/server/mailtrap";
import type { QuotePayload } from "@/lib/server/quote-payload";

const MIN_FILL_MS = 2500;

export async function submitQuote(
  _previous: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  // Maintenance switch: refuse before reading or sending anything.
  if (!isQuoteFormEnabled()) return { status: "error", code: "disabled" };

  const text = (key: string, max = 500) =>
    String(formData.get(key) ?? "").trim().slice(0, max);

  // Honeypot: real visitors never see this field. Pretend it worked so bots learn nothing.
  if (text("website")) return { status: "success" };

  // Submitted faster than a person can fill it in.
  const elapsed = Number(formData.get("elapsed"));
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: "error", code: "tooFast" };
  }

  const email = text("email", 254);
  const cargo = text("cargo", 1000);
  const name = text("name", 200);
  const rawClientType = text("clientType", 20);
  const clientType: ClientType = (clientTypes as readonly string[]).includes(rawClientType)
    ? (rawClientType as ClientType)
    : "company";
  // Individuals have no company name.
  const company = clientType === "company" ? text("company", 200) : "";
  const phone = text("phone", 50);

  const fields = validateQuote({ clientType, cargo, name, company, email, phone });
  if (Object.keys(fields).length > 0) {
    return { status: "error", code: "validation", fields };
  }

  const rawMode = text("mode", 20);
  const mode: QuoteMode = (quoteModes as readonly string[]).includes(rawMode)
    ? (rawMode as QuoteMode)
    : "unsure";
  const rawLang = text("lang", 5);

  const payload: QuotePayload = {
    receivedAt: new Date().toISOString(),
    lang: hasLocale(rawLang) ? rawLang : "es",
    mode,
    origin: text("origin", 200),
    destination: text("destination", 200),
    cargo,
    weight: text("weight", 100),
    packages: text("packages", 100),
    dims: text("dims", 200),
    packaging: text("packaging", 200),
    value: text("value", 100),
    ready: text("ready", 100),
    modeFieldValue: text("modeFieldValue", 500),
    clientType,
    name,
    company,
    rif: text("rif", 50),
    email,
    phone,
    notes: text("notes", 1000).replace(/\r\n?/g, "\n"),
  };

  // Email is the main channel. The Sheet is optional (QUOTE_SHEET_ENABLED) and independent of it:
  // the lead is safe if any enabled channel works.
  const channels = [
    { name: "email", run: () => sendQuoteEmail(payload) },
    ...(isSheetEnabled() ? [{ name: "sheet", run: () => appendQuoteToSheet(payload) }] : []),
  ];
  const results = await Promise.allSettled(channels.map((c) => c.run()));
  results.forEach((result, i) => {
    if (result.status === "rejected") console.error(`[quote] ${channels[i].name} failed:`, result.reason);
  });

  if (results.every((r) => r.status === "rejected")) {
    return { status: "error", code: "delivery" };
  }
  return { status: "success" };
}
