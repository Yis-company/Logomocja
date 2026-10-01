import type { CSSProperties } from "react";
const paths = {
  trophy:
    "M8 4h8v8a4 4 0 0 1-8 0ZM8 6H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 16v4m-4 0h8",
  menu: "M4 6h16M4 12h16M4 18h16",
  moon: "M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z",
  play: "m8 5 11 7-11 7Z",
  pause: "M8 5v14M16 5v14",
  step: "m5 5 10 7-10 7ZM19 5v14",
  reset: "M3 10a9 9 0 1 1 2 8M3 4v6h6",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
  cube: "m12 3 9 5v8l-9 5-9-5V8ZM3 8l9 5 9-5M12 13v8",
  plane: "M4 4h16v16H4ZM4 12h16M12 4v16",
  book: "M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1ZM12 5v15",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  fit: "M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 4 4 10-10",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z",
  help: "M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01",
  close: "m6 6 12 12M18 6 6 18",
  grid: "M4 4h6v6H4ZM14 4h6v6h-6ZM4 14h6v6H4ZM14 14h6v6h-6Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
} as const;
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: keyof typeof paths;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function TurtleMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <ellipse cx="20" cy="21" rx="10" ry="12" />
        <ellipse cx="20" cy="6" rx="4" ry="5" />
        <ellipse cx="9" cy="14" rx="5" ry="3" transform="rotate(-35 9 14)" />
        <ellipse cx="31" cy="14" rx="5" ry="3" transform="rotate(35 31 14)" />
        <ellipse cx="9" cy="29" rx="5" ry="3" transform="rotate(35 9 29)" />
        <ellipse cx="31" cy="29" rx="5" ry="3" transform="rotate(-35 31 29)" />
        <path d="m17 32 3 6 3-6Z" />
      </g>
      <path
        d="M20 11v21M11 17l9 5 9-5M12 27l8-5 8 5"
        stroke="var(--paper)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
