import { contactEmail } from "./site";

export type QuoteFields = {
  mode: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  packages: string;
  dims: string;
  packaging: string;
  value: string;
  ready: string;
  modeFieldLabel: string;
  modeFieldValue: string;
  clientType: string;
  name: string;
  company: string;
  rif: string;
  phone: string;
  notes: string;
};

export type QuoteMailLabels = {
  subject: string;
  mode: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  packages: string;
  dims: string;
  packaging: string;
  value: string;
  ready: string;
  clientType: string;
  name: string;
  company: string;
  rif: string;
  phone: string;
  notes: string;
};

/** Builds the mailto: link. Empty fields stay as empty labelled lines so the sender can fill them in. */
export function buildQuoteHref(labels: QuoteMailLabels, f: QuoteFields): string {
  const body = [
    `${labels.mode}: ${f.mode}`,
    `${labels.origin}: ${f.origin}`,
    `${labels.destination}: ${f.destination}`,
    `${labels.cargo}: ${f.cargo}`,
    "",
    `${labels.weight}: ${f.weight}`,
    `${labels.packages}: ${f.packages}`,
    `${labels.dims}: ${f.dims}`,
    `${labels.packaging}: ${f.packaging}`,
    `${labels.value}: ${f.value}`,
    `${labels.ready}: ${f.ready}`,
    `${f.modeFieldLabel}: ${f.modeFieldValue}`,
    "",
    `${labels.clientType}: ${f.clientType}`,
    `${labels.name}: ${f.name}`,
    `${labels.company}: ${f.company}`,
    `${labels.rif}: ${f.rif}`,
    `${labels.phone}: ${f.phone}`,
    "",
    `${labels.notes}: ${f.notes}`,
  ].join("\n");

  return `mailto:${contactEmail}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(body)}`;
}
