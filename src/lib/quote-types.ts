export const quoteModes = ["maritime", "air", "land", "multimodal", "unsure"] as const;
export type QuoteMode = (typeof quoteModes)[number];

export const clientTypes = ["company", "individual"] as const;
export type ClientType = (typeof clientTypes)[number];

export type QuoteFieldErrors = {
  cargo?: "required";
  name?: "required";
  company?: "required";
  email?: "required" | "invalid";
  phone?: "required" | "invalid";
};

export type QuoteState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "tooFast" | "delivery" | "disabled";
      fields?: QuoteFieldErrors;
    };

export const initialQuoteState: QuoteState = { status: "idle" };
