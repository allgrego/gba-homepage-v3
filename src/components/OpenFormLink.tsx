"use client";

import type { ReactNode } from "react";

export const OPEN_QUOTE_DETAILS_EVENT = "gba:open-quote-details";

/** Anchor to #cotizar that also asks the quote card to expand its extra details. */
export function OpenFormLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#cotizar"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_QUOTE_DETAILS_EVENT))}
    >
      {children}
    </a>
  );
}
