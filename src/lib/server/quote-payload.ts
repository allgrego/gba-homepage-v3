import "server-only";
import es from "@/app/[lang]/dictionaries/es.json";
import type { Locale } from "@/lib/i18n";
import type { ClientType, QuoteMode } from "@/lib/quote-types";

/** A validated quote request, ready to be delivered. */
export type QuotePayload = {
  receivedAt: string;
  lang: Locale;
  mode: QuoteMode;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  packages: string;
  dims: string;
  packaging: string;
  value: string;
  ready: string;
  modeFieldValue: string;
  clientType: ClientType;
  name: string;
  company: string;
  rif: string;
  email: string;
  phone: string;
  notes: string;
};

// Messages for the sales team are always in Spanish, whatever language the visitor used.
const q = es.quote;

export const modeLabel = (mode: QuoteMode) => q.modes[mode];
export const clientTypeLabel = (type: ClientType) => q.clientTypes[type];
export const modeFieldLabel = (mode: QuoteMode) => q.modeFields[mode].label;

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export function buildEmailSubject(p: QuotePayload): string {
  const route = [p.origin, p.destination].filter(Boolean).map(oneLine).join(" → ");
  const subject = `Nueva solicitud de cotización · ${modeLabel(p.mode)}${route ? ` · ${route}` : ""}`;
  return subject.slice(0, 200);
}

export function buildEmailText(p: QuotePayload): string {
  const line = (label: string, value: string) => `${label}: ${value || "—"}`;
  return [
    "Nueva solicitud de cotización desde gbalogistic.com",
    "",
    line("Correo", p.email),
    line("Teléfono", p.phone),
    line("Tipo de cliente", clientTypeLabel(p.clientType)),
    line("Nombre", p.name),
    line("Empresa", p.company),
    line("RIF", p.rif),
    "",
    line("Modo de transporte", modeLabel(p.mode)),
    line("Origen", p.origin),
    line("Destino", p.destination),
    line("Mercancía", p.cargo),
    "",
    line("Peso bruto total (kg)", p.weight),
    line("Cantidad de bultos", p.packages),
    line("Medidas por bulto", p.dims),
    line("Tipo de embalaje", p.packaging),
    line("Valor de la mercancía (USD)", p.value),
    line("Fecha en que está lista", p.ready),
    line(modeFieldLabel(p.mode), p.modeFieldValue),
    "Comentarios del cliente:",
    p.notes || "—",
    "",
    `Idioma del visitante: ${p.lang === "es" ? "español" : "inglés"}`,
    `Recibida: ${p.receivedAt}`,
    "",
    "Responde a este correo para contestar directamente al cliente.",
  ].join("\n");
}
