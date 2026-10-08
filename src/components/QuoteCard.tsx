"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitQuote } from "@/app/actions/quote";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n";
import {
  initialQuoteState,
  type ClientType,
  type QuoteFieldErrors,
  type QuoteState,
} from "@/lib/quote-types";
import { validateQuote, validateShipment } from "@/lib/quote-validation";
import { buildQuoteHref } from "@/lib/quote";
import { contactEmail } from "@/lib/site";
import { OPEN_QUOTE_DETAILS_EVENT } from "./OpenFormLink";

type Mode = keyof Dictionary["quote"]["modes"];
const modeOrder: Mode[] = ["maritime", "air", "land", "multimodal"];
const unsureMode: Mode = "unsure";
const clientTypeOrder: ClientType[] = ["company", "individual"];

type FieldKey =
  | "origin"
  | "destination"
  | "cargo"
  | "email"
  | "weight"
  | "packages"
  | "dims"
  | "packaging"
  | "value"
  | "ready"
  | "modeFieldValue"
  | "name"
  | "company"
  | "rif"
  | "phone"
  | "notes";

const emptyValues: Record<FieldKey, string> = {
  origin: "",
  destination: "",
  cargo: "",
  email: "",
  weight: "",
  packages: "",
  dims: "",
  packaging: "",
  value: "",
  ready: "",
  modeFieldValue: "",
  name: "",
  company: "",
  rif: "",
  phone: "",
  notes: "",
};

function Field({
  name,
  label,
  placeholder,
  value,
  onChange,
  half,
  type = "text",
  required,
  autoComplete,
  error,
  multiline,
}: {
  name: FieldKey;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  half?: boolean;
  type?: "text" | "email" | "tel";
  required?: boolean;
  autoComplete?: string;
  error?: string;
  multiline?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${half ? "" : "col-span-full"}`}>
      <label htmlFor={id} className="label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          maxLength={1000}
          className="field resize-y"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className="field"
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-semibold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

function QuoteForm({
  t,
  lang,
  onReset,
}: {
  t: Dictionary["quote"];
  lang: Locale;
  onReset: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [mode, setMode] = useState<Mode>("maritime");
  const [clientType, setClientType] = useState<ClientType>("company");
  const [showMore, setShowMore] = useState(false);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [state, formAction, pending] = useActionState<QuoteState, FormData>(
    submitQuote,
    initialQuoteState,
  );
  const detailsId = useId();
  const modeLabelId = useId();
  const openedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    openedAt.current = Date.now();
    // "Ir al formulario" opens the extra shipment details, which live in step 1.
    const open = () => {
      setStep(1);
      setShowMore(true);
    };
    window.addEventListener(OPEN_QUOTE_DETAILS_EVENT, open);
    return () => window.removeEventListener(OPEN_QUOTE_DETAILS_EVENT, open);
  }, []);

  // After changing step, keep the visitor oriented: bring the card into view and focus the first field.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    const form = formRef.current;
    if (!form) return;
    const card = form.closest<HTMLElement>("#cotizar");
    if (card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ block: "start" });
    form
      .querySelector<HTMLInputElement>(step === 2 ? 'input[name="name"]' : 'input[name="origin"]')
      ?.focus({ preventScroll: true });
  }, [step]);

  const set = (key: FieldKey) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear the error of the field being edited.
    setErrors((prev) => (key in prev ? { ...prev, [key]: undefined } : prev));
  };

  const goTo = (next: 1 | 2) => {
    moveFocus.current = true;
    setStep(next);
  };

  const goNext = () => {
    const found = validateShipment(values);
    setErrors(found);
    if (Object.keys(found).length === 0) goTo(2);
  };

  const submit = (formData: FormData) => {
    // Enter inside step 1 means "continue", not "send".
    if (step === 1) {
      goNext();
      return;
    }
    const found = validateQuote({ ...values, clientType });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Submitting faster than a person can type is a bot signal (checked on the server).
    formData.set("elapsed", String(Date.now() - (openedAt.current ?? Date.now())));
    formAction(formData);
  };

  const modeField = t.modeFields[mode];

  if (state.status === "success") {
    return (
      <div role="status">
        <h3 className="text-xl font-bold text-navy">{t.success.title}</h3>
        <p className="mt-2 text-[15px] leading-[1.6]">{t.success.text}</p>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-primary mt-5 block min-h-12 w-full cursor-pointer p-4 text-base"
        >
          {t.success.again}
        </button>
      </div>
    );
  }

  // Client-side errors win; the server only reports them when the browser check was bypassed.
  const serverFields = state.status === "error" ? (state.fields ?? {}) : {};
  const fieldErrors: QuoteFieldErrors = { ...serverFields, ...errors };
  const emailError =
    fieldErrors.email === "required"
      ? t.errors.emailRequired
      : fieldErrors.email === "invalid"
        ? t.errors.emailInvalid
        : undefined;
  const phoneError =
    fieldErrors.phone === "required"
      ? t.errors.phoneRequired
      : fieldErrors.phone === "invalid"
        ? t.errors.phoneInvalid
        : undefined;
  const cargoError = fieldErrors.cargo ? t.errors.cargoRequired : undefined;
  const nameError = fieldErrors.name ? t.errors.nameRequired : undefined;
  const companyError = fieldErrors.company ? t.errors.companyRequired : undefined;

  // Shown only if sending fails, so the visitor can still reach us from their own email app.
  const fallbackHref = buildQuoteHref(t.mail, {
    mode: t.modes[mode],
    ...values,
    clientType: t.clientTypes[clientType],
    // Individuals have no company name.
    company: clientType === "company" ? values.company : "",
    modeFieldLabel: modeField.label,
  });

  // Both steps stay mounted in the same grid cell: the card keeps the taller step's height (no jumping
  // between steps) and every field is part of the submitted form. The inactive step is inert.
  const panelClass = (n: 1 | 2) =>
    `col-start-1 row-start-1 flex flex-col ${step === n ? "" : "invisible"}`;

  return (
    <form ref={formRef} noValidate action={submit}>
      <h2 className="mb-3 text-2xl font-bold text-navy">{t.title}</h2>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="mode" value={mode} />
      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mb-4">
        <div aria-live="polite" className="mb-2 flex items-baseline justify-between gap-3 text-[13px]">
          <span className="font-bold text-navy">{step === 1 ? t.step1Title : t.step2Title}</span>
          <span className="text-muted">
            {t.stepLabel} {step} {t.stepOf} 2
          </span>
        </div>
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-1 flex-1 bg-green" />
          <span className={`h-1 flex-1 ${step === 2 ? "bg-green" : "bg-rule"}`} />
        </div>
      </div>

      <div className="grid">
        {/* Step 1: the shipment */}
        <div
          data-step="1"
          inert={step !== 1}
          aria-hidden={step !== 1}
          className={panelClass(1)}
          onKeyDown={(e) => {
            // Enter in a text field means "continue", never "send" (the send button lives in step 2).
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              goNext();
            }
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <span id={modeLabelId} className="label">
              {t.modeAria}
            </span>
            {/* Negative margin keeps the 44px touch target without adding row height. */}
            <button
              type="button"
              aria-pressed={mode === unsureMode}
              onClick={() => setMode(mode === unsureMode ? "maritime" : unsureMode)}
              className={`-my-3 inline-flex min-h-11 cursor-pointer items-center text-right text-[13px] font-semibold ${
                mode === unsureMode ? "text-navy" : "text-[#2e5fa8] underline"
              }`}
            >
              {mode === unsureMode ? `✓ ${t.modes[unsureMode]}` : t.unsureLink}
            </button>
          </div>
          <div
            role="group"
            aria-labelledby={modeLabelId}
            className="mb-4 flex flex-wrap overflow-hidden rounded-[2px] border-[1.5px] border-navy"
          >
            {modeOrder.map((m) => (
              <button
                key={m}
                type="button"
                className="seg-btn sm:flex-1"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
              >
                {t.modes[m]}
              </button>
            ))}
          </div>
          {mode === unsureMode && (
            <p role="status" className="-mt-1 mb-4 text-[13px] leading-normal text-muted">
              {t.unsureNote}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field half name="origin" label={t.origin} placeholder={t.originPh} value={values.origin} onChange={set("origin")} />
            <Field half name="destination" label={t.destination} placeholder={t.destinationPh} value={values.destination} onChange={set("destination")} />
            <Field name="cargo" required label={t.cargo} placeholder={t.cargoPh} value={values.cargo} onChange={set("cargo")} error={cargoError} />
          </div>

          <button
            type="button"
            aria-expanded={showMore}
            aria-controls={detailsId}
            onClick={() => setShowMore((v) => !v)}
            className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-between rounded-[2px] border-[1.5px] border-[#c5d2e4] bg-[#f3f6fa] px-4 text-[15px] font-bold text-navy"
          >
            <span>{showMore ? t.moreClose : t.moreOpen}</span>
            <span aria-hidden="true" className="text-2xl leading-none">
              {showMore ? "−" : "+"}
            </span>
          </button>

          <div id={detailsId} hidden={!showMore}>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field half name="weight" label={t.weight} placeholder={t.weightPh} value={values.weight} onChange={set("weight")} />
              <Field half name="packages" label={t.packages} placeholder={t.packagesPh} value={values.packages} onChange={set("packages")} />
              <Field half name="dims" label={t.dims} placeholder={t.dimsPh} value={values.dims} onChange={set("dims")} />
              <Field half name="packaging" label={t.packaging} placeholder={t.packagingPh} value={values.packaging} onChange={set("packaging")} />
              <Field half name="value" label={t.value} placeholder={t.valuePh} value={values.value} onChange={set("value")} />
              <Field half name="ready" label={t.ready} placeholder={t.readyPh} value={values.ready} onChange={set("ready")} />
              <Field name="modeFieldValue" label={modeField.label} placeholder={modeField.placeholder} value={values.modeFieldValue} onChange={set("modeFieldValue")} />
              <Field name="rif" label={t.rif} placeholder={t.rifPh} value={values.rif} onChange={set("rif")} />
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={goNext}
              className="btn btn-primary block min-h-12 w-full cursor-pointer p-4 text-base"
            >
              {t.next}
            </button>
            <p className="mt-3 text-center text-[12.5px] leading-normal text-muted">
              {t.helpBefore}
              <a href="#cotizar-datos" className="font-semibold text-[#2e5fa8] underline">
                {t.helpLink}
              </a>
              {t.helpAfter}
            </p>
          </div>
        </div>

        {/* Step 2: contact details and send */}
        <div data-step="2" inert={step !== 2} aria-hidden={step !== 2} className={panelClass(2)}>
          <fieldset className="mb-3">
            <legend className="label mb-2">{t.clientTypeLabel}</legend>
            <div className="flex overflow-hidden rounded-[2px] border-[1.5px] border-navy">
              {clientTypeOrder.map((type) => (
                <label
                  key={type}
                  className="flex min-h-11 flex-1 cursor-pointer items-center justify-center bg-white px-3 text-sm font-semibold text-navy has-checked:bg-navy has-checked:text-white has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-blue"
                >
                  <input
                    type="radio"
                    name="clientType"
                    value={type}
                    checked={clientType === type}
                    onChange={() => setClientType(type)}
                    className="sr-only"
                  />
                  {t.clientTypes[type]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field half={clientType === "company"} name="name" required autoComplete="name" label={t.name} placeholder={t.namePh} value={values.name} onChange={set("name")} error={nameError} />
            {clientType === "company" && (
              <Field half name="company" required autoComplete="organization" label={t.company} placeholder={t.companyPh} value={values.company} onChange={set("company")} error={companyError} />
            )}
            <Field half name="email" type="email" required autoComplete="email" label={t.email} placeholder={t.emailPh} value={values.email} onChange={set("email")} error={emailError} />
            <Field half name="phone" type="tel" required autoComplete="tel" label={t.phone} placeholder={t.phonePh} value={values.phone} onChange={set("phone")} error={phoneError} />
            <Field multiline name="notes" label={t.notes} placeholder={t.notesPh} value={values.notes} onChange={set("notes")} />
          </div>

          <div aria-live="polite">
            {state.status === "error" && state.code !== "validation" && (
              <p className="mt-4 text-sm font-semibold leading-normal text-[#b3261e]">
                {state.code === "tooFast"
                  ? t.errors.tooFast
                  : state.code === "disabled"
                    ? t.errors.disabled
                    : t.errors.delivery}
                {(state.code === "delivery" || state.code === "disabled") && (
                  <>
                    {" "}
                    <a href={fallbackHref} className="underline">
                      {t.errors.fallback}
                    </a>
                  </>
                )}
              </p>
            )}
            {/* The browser check normally catches this on step 1; shown only if it was bypassed. */}
            {state.status === "error" && state.code === "validation" && serverFields.cargo && (
              <p className="mt-4 text-sm font-semibold leading-normal text-[#b3261e]">
                {t.errors.cargoRequired}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goTo(1)}
                className="min-h-12 cursor-pointer rounded-[2px] border-[1.5px] border-navy px-5 text-[15px] font-semibold text-navy"
              >
                {t.back}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary min-h-12 flex-1 cursor-pointer p-4 text-base disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? t.sending : t.submit}
              </button>
            </div>
            <p className="mt-3 text-center text-[12.5px] leading-normal text-muted">{t.consent}</p>
          </div>
        </div>
      </div>
    </form>
  );
}

export function QuoteCard({
  t,
  lang,
  disabled,
}: {
  t: Dictionary["quote"];
  lang: Locale;
  disabled: boolean;
}) {
  // Changing the key remounts the form with empty fields ("send another request").
  const [formKey, setFormKey] = useState(0);

  return (
    <div
      id="cotizar"
      className="relative scroll-mt-24 rounded-[2px] border-t-[6px] border-green bg-white p-5 text-body sm:scroll-mt-28 sm:p-6"
    >
      {disabled ? (
        <>
          <h2 className="mb-1.5 text-2xl font-bold text-navy">{t.maintenance.title}</h2>
          <p className="mb-5 text-[15px] leading-[1.6]">{t.maintenance.text}</p>
          <a href={`mailto:${contactEmail}`} className="btn btn-primary block p-4 text-base">
            {t.maintenance.button}: {contactEmail}
          </a>
        </>
      ) : (
        <QuoteForm key={formKey} t={t} lang={lang} onReset={() => setFormKey((k) => k + 1)} />
      )}
    </div>
  );
}
