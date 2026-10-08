import type { ReactNode } from "react";

type HeadingProps = {
  light: string;
  bold: string;
  /** Tailwind color class for the bold part */
  boldClass?: string;
  className?: string;
  id?: string;
  as?: "h1" | "h2";
};

/** Headings in the design mix a light and a bold weight in the same line. */
export function Heading({
  light,
  bold,
  boldClass = "text-green-text",
  className = "",
  id,
  as: Tag = "h2",
}: HeadingProps): ReactNode {
  return (
    <Tag id={id} className={`font-light ${className}`}>
      {light} <strong className={`font-bold ${boldClass}`}>{bold}</strong>
    </Tag>
  );
}
