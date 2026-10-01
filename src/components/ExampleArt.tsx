import type { Example } from "../examples";
export function ExampleArt({ example }: { example: Example }) {
  const kind = example.id === "procedure-rosette" ? "rosette" : example.id;
  const color =
    kind === "star" ? "#bd7946" : kind === "spiral" ? "#9471b6" : "#368569";
  return (
    <svg viewBox="0 0 120 88" aria-hidden="true" className="example-art">
      <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
        {kind === "square" && <path d="M34 18h52v52H34Z" />}
        {kind === "star" && <path d="m60 12 19 59-50-37h62L41 71Z" />}
        {kind === "rosette" &&
          Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => (
            <rect
              key={angle}
              x="60"
              y="20"
              width="27"
              height="27"
              transform={`rotate(${angle} 60 44)`}
            />
          ))}
        {kind === "stairs" && (
          <path
            d="M15 71 32 64V54l17-7V37l17-7V20l17-7V3"
            transform="translate(8 8)"
          />
        )}
        {kind === "cube" && (
          <>
            <path d="m60 12 30 17v35L60 81 30 64V29ZM30 29l30 18 30-18M60 47v34" />
            <path
              d="M60 12v34M30 64l30-18 30 18"
              strokeDasharray="3 3"
              opacity=".5"
            />
          </>
        )}
        {kind === "spiral" && (
          <path d="M39 76c-25-11 1-26 35-20s11 21-15 15S25 47 51 45s43 6 27 16-47-1-41-14 47-13 49-2-45 17-49-1 23-27 42-17-19 22-30 7-1-24 16-22" />
        )}
      </g>
    </svg>
  );
}
