import "server-only";
import { buildEmailSubject, buildEmailText, type QuotePayload } from "./quote-payload";

/** Sends the quote to the sales inbox through Mailtrap's HTTP API (Email Sending, not Sandbox). */
export async function sendQuoteEmail(payload: QuotePayload): Promise<void> {
  const token = process.env.MAILTRAP_API_TOKEN;
  const from = process.env.MAILTRAP_FROM_EMAIL;
  const to = process.env.QUOTE_TO_EMAIL;
  if (!token || !from || !to) throw new Error("Mailtrap env vars are not configured");

  const res = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: from, name: "GBA Logistics Web" },
      to: [{ email: to }],
      // "Reply" in the sales inbox goes straight to the visitor.
      reply_to: { email: payload.email },
      subject: buildEmailSubject(payload),
      text: buildEmailText(payload),
      category: "quote-request",
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Mailtrap responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}
