import { memo } from "react";
import Creature from "./Creature.jsx";

const PEEKERS = [
  { kind: "sproutle", className: "left-[3%] bottom-[54px] size-16", delay: "0s" },
  { kind: "drizzlet", className: "left-[11%] bottom-[30px] size-12 max-lg:hidden", delay: "0.6s" },
  { kind: "embercub", className: "right-[10%] bottom-[34px] size-14 max-lg:hidden", delay: "0.3s" },
  { kind: "sparkit", className: "right-[3%] bottom-[60px] size-16", delay: "0.9s" },
];

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 120 50" className={`absolute fill-white/90 ${className}`}>
      <path d="M20 46 C6 46 4 30 16 28 C16 14 34 10 42 20 C48 6 72 6 76 22 C88 16 104 22 100 34 C114 34 116 46 104 46 Z" />
    </svg>
  );
}

/** Fixed, decorative scene behind the app: sky, clouds, rolling grass and a few residents. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#8fd0ff_0%,#cdeeff_45%,#eaf8ff_75%,#e3f6dc_100%)]" />

      <Cloud className="drift top-[8%] left-[6%] w-36" />
      <Cloud className="drift top-[18%] right-[8%] w-48 [animation-delay:-14s]" />
      <Cloud className="drift top-[42%] left-[44%] w-28 opacity-70 [animation-delay:-28s]" />

      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[150px] w-full">
        <path d="M0 90 C240 30 420 120 720 70 C1000 25 1200 110 1440 60 V200 H0 Z" fill="#8fd77e" />
        <path d="M0 130 C300 90 520 160 820 120 C1100 85 1280 150 1440 120 V200 H0 Z" fill="#5cbf5a" />
      </svg>

      {PEEKERS.map((peeker) => (
        <div
          key={peeker.kind}
          className={`bob absolute ${peeker.className}`}
          style={{ animationDelay: peeker.delay }}
        >
          <Creature kind={peeker.kind} className="size-full drop-shadow-[0_4px_0_rgba(27,35,64,0.15)]" />
        </div>
      ))}
    </div>
  );
}

// Memoized: its props stay the same while the loop animates.
export default memo(Backdrop);
