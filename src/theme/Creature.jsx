import { CREATURES } from "./creatures.js";

const INK = "#1b2340";
const OUTLINE = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" };

function Face({ cx, cy }) {
  return (
    <g>
      <ellipse cx={cx - 11} cy={cy + 4} rx="2.8" ry="1.6" fill="#ff7a9c" opacity="0.55" />
      <ellipse cx={cx + 11} cy={cy + 4} rx="2.8" ry="1.6" fill="#ff7a9c" opacity="0.55" />
      <ellipse cx={cx - 6.5} cy={cy} rx="2.6" ry="3.4" fill={INK} />
      <ellipse cx={cx + 6.5} cy={cy} rx="2.6" ry="3.4" fill={INK} />
      <circle cx={cx - 5.7} cy={cy - 1.3} r="0.95" fill="#fff" />
      <circle cx={cx + 7.3} cy={cy - 1.3} r="0.95" fill="#fff" />
      <path
        d={`M ${cx - 3} ${cy + 5} Q ${cx} ${cy + 8} ${cx + 3} ${cy + 5}`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

const Feet = ({ fill }) => (
  <g {...OUTLINE} strokeWidth="2" fill={fill}>
    <ellipse cx="23" cy="57" rx="5.5" ry="3.2" />
    <ellipse cx="41" cy="57" rx="5.5" ry="3.2" />
  </g>
);

const DRAWINGS = {
  sparkit: () => (
    <>
      <Feet fill="#e3ad00" />
      <line x1="32" y1="24" x2="32" y2="15" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="34,3 25,14 31,14 28,22 39,10 33,10" fill="#ffd23f" {...OUTLINE} strokeWidth="2" />
      <ellipse cx="32" cy="40" rx="19" ry="17" fill="#ffd23f" {...OUTLINE} />
      <ellipse cx="32" cy="47" rx="10" ry="6.5" fill="#fff3c2" />
      <Face cx={32} cy={37} />
    </>
  ),
  embercub: () => (
    <>
      <Feet fill="#d9622a" />
      <path
        d="M32 5 C37 12 41 15 39 22 C42 19 44 16 44 12 C49 19 47 27 42 30 L22 30 C17 27 15 20 20 15 C21 19 23 21 25 21 C24 14 27 9 32 5 Z"
        fill="#ffb02e"
        {...OUTLINE}
        strokeWidth="2"
      />
      <circle cx="32" cy="40" r="18" fill="#ff8a3d" {...OUTLINE} />
      <ellipse cx="32" cy="47" rx="10" ry="6.5" fill="#ffe1c7" />
      <Face cx={32} cy={38} />
    </>
  ),
  drizzlet: () => (
    <>
      <circle cx="51" cy="13" r="3" fill="#cfeaff" stroke={INK} strokeWidth="1.5" />
      <circle cx="56" cy="22" r="1.8" fill="#cfeaff" stroke={INK} strokeWidth="1.3" />
      <path d="M50 38 C58 35 61 42 56 47 C54 45 52 45 50 44 Z" fill="#2f86e0" {...OUTLINE} strokeWidth="2" />
      <path
        d="M32 9 C40 21 51 29 51 42 C51 53 43 60 32 60 C21 60 13 53 13 42 C13 29 24 21 32 9 Z"
        fill="#4aa8ff"
        {...OUTLINE}
      />
      <ellipse cx="32" cy="50" rx="10" ry="6" fill="#d6eeff" />
      <Face cx={32} cy={40} />
    </>
  ),
  sproutle: () => (
    <>
      <Feet fill="#3a9447" />
      <line x1="32" y1="25" x2="32" y2="19" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 20 C24 8 13 8 11 13 C15 21 24 23 31 20 Z" fill="#3fa34d" {...OUTLINE} strokeWidth="2" />
      <path d="M33 20 C38 6 50 5 52 10 C50 19 41 23 33 20 Z" fill="#7ad36b" {...OUTLINE} strokeWidth="2" />
      <ellipse cx="32" cy="41" rx="20" ry="16.5" fill="#5cc46a" {...OUTLINE} />
      <circle cx="18" cy="34" r="2" fill="#3fa34d" />
      <circle cx="46" cy="35" r="2.4" fill="#3fa34d" />
      <ellipse cx="32" cy="48" rx="10" ry="6" fill="#dcf5d3" />
      <Face cx={32} cy={39} />
    </>
  ),
};

/**
 * An original creature mascot. Renders as its own <svg>, so it works both in HTML
 * and nested inside another SVG (pass x / y / width / height).
 */
export default function Creature({ kind, label, className, ...svgProps }) {
  const creature = CREATURES[kind];
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  if (creature.imageSrc) {
    return (
      <img
        src={creature.imageSrc}
        alt={label ?? ""}
        className={`object-contain [image-rendering:pixelated] ${className ?? ""}`}
      />
    );
  }

  const Drawing = DRAWINGS[kind];
  return (
    <svg viewBox="0 0 64 64" className={className} {...a11y} {...svgProps}>
      <Drawing />
    </svg>
  );
}
