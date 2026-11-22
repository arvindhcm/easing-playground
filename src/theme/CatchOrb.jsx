const INK = "#1b2340";

/** The theme's capture orb: violet cap, cream base, gold star clasp. */
export default function CatchOrb({ className, ...svgProps }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...svgProps}>
      <circle cx="16" cy="16" r="14" fill="#fff6e4" />
      <path d="M2 16 A14 14 0 0 1 30 16 Z" fill="#7b5cff" />
      <path d="M7 9.5 A9 9 0 0 1 13 6" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="14" fill="none" stroke={INK} strokeWidth="2.2" />
      <line x1="2" y1="16" x2="30" y2="16" stroke={INK} strokeWidth="2.2" />
      <polygon
        points="16,10.6 17.6,14.4 21.6,14.6 18.5,17.1 19.5,21 16,18.8 12.5,21 13.5,17.1 10.4,14.6 14.4,14.4"
        fill="#ffcb05"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
