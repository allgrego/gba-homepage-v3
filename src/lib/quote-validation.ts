import type { ClientType, QuoteFieldErrors } from "./quote-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9+()\-.\s]{7,}$/;
const countDigits = (value: string) => value.replace(/\D/g, "").length;

/** Step 1: the shipment. */
export function validateShipment(v: { cargo: string }): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  if (v.cargo.trim().length < 3) errors.cargo = "required";
  return errors;
}

/** Step 2: who to reply to. */
export function validateContact(v: {
  clientType: ClientType;
  name: string;
  company: string;
  email: string;
  phone: string;
}): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  const email = v.email.trim();
  const phone = v.phone.trim();

  if (!v.name.trim()) errors.name = "required";
  // Only companies need a company name.
  if (v.clientType === "company" && !v.company.trim()) errors.company = "required";
  if (!email) errors.email = "required";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalid";
  if (!phone) errors.phone = "required";
  else if (!PHONE_PATTERN.test(phone) || countDigits(phone) < 7) errors.phone = "invalid";
  return errors;
}

/** Shared by the browser (instant feedback) and the Server Action (the one that actually enforces it). */
export function validateQuote(v: {
  clientType: ClientType;
  cargo: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}): QuoteFieldErrors {
  return { ...validateShipment(v), ...validateContact(v) };
}
