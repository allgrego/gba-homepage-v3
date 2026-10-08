import "server-only";
import { clientTypeLabel, modeFieldLabel, modeLabel, type QuotePayload } from "./quote-payload";

/** Appends the quote to the Google Sheet through the Apps Script web app (see integrations/google-apps-script). */
export async function appendQuoteToSheet(payload: QuotePayload): Promise<void> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) throw new Error("Apps Script env vars are not configured");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Apps Script web apps cannot read request headers, so the shared secret travels in the body.
    body: JSON.stringify({
      secret,
      row: {
        receivedAt: payload.receivedAt,
        lang: payload.lang,
        mode: modeLabel(payload.mode),
        origin: payload.origin,
        destination: payload.destination,
        cargo: payload.cargo,
        weight: payload.weight,
        packages: payload.packages,
        dims: payload.dims,
        packaging: payload.packaging,
        value: payload.value,
        ready: payload.ready,
        modeFieldLabel: modeFieldLabel(payload.mode),
        modeFieldValue: payload.modeFieldValue,
        clientType: clientTypeLabel(payload.clientType),
        name: payload.name,
        company: payload.company,
        rif: payload.rif,
        email: payload.email,
        phone: payload.phone,
        notes: payload.notes,
      },
    }),
    // The script answers through a redirect; fetch follows it by default.
    signal: AbortSignal.timeout(15_000),
  });

  const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !body?.ok) {
    throw new Error(`Apps Script failed (${res.status}): ${body?.error ?? "no JSON response"}`);
  }
}
