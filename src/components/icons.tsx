import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  square?: boolean;
  children: ReactNode;
};

function Icon({ size = 24, stroke = "currentColor", strokeWidth = 1.7, square, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={square ? "square" : "round"}
      strokeLinejoin={square ? "miter" : "round"}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type TileIconProps = { size?: number };

export const tileIcons = {
  fcl: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6} square>
      <rect x="2" y="6" width="20" height="12" />
      <path d="M6 6v12M10 6v12M14 6v12M18 6v12" />
    </Icon>
  ),
  lcl: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6} square>
      <path d="M3 21v-8h8v8z" />
      <path d="M13 21V9h8v12z" />
      <path d="M7 13V5h8v4" />
    </Icon>
  ),
  air: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </Icon>
  ),
  land: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Icon>
  ),
  multimodal: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6}>
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="m4 4 5 5" />
    </Icon>
  ),
  door: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6} square>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </Icon>
  ),
  courier: ({ size = 34 }: TileIconProps) => (
    <Icon size={size} stroke="#fff" strokeWidth={1.6}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Icon>
  ),
};

export type TileIconId = keyof typeof tileIcons;

export function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="square" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export const ShieldIcon = () => (
  <Icon size={30} stroke="#fff">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </Icon>
);

export const ClipboardIcon = () => (
  <Icon size={30} stroke="#fff">
    <rect width="8" height="4" x="8" y="2" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </Icon>
);

export const BulbIcon = () => (
  <Icon size={30} stroke="#fff">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </Icon>
);

export const MailIcon = () => (
  <Icon size={26} stroke="#fff" strokeWidth={1.8}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);

export const PinIcon = () => (
  <Icon size={26} stroke="#0e2238" strokeWidth={1.8}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
