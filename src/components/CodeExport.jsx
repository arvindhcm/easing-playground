import { memo, useEffect, useState } from "react";
import { formatCurveNumber } from "../lib/cubicBezier.js";

const FORMATS = [
  {
    name: "CSS",
    build: (numbers, durationMs) =>
      `transition: transform ${durationMs}ms cubic-bezier(${numbers.join(", ")});`,
  },
  {
    name: "Tailwind",
    build: (numbers, durationMs) =>
      `transition-transform duration-${durationMs} ease-[cubic-bezier(${numbers.join(",")})]`,
  },
  {
    name: "Motion",
    build: (numbers, durationMs) =>
      `transition={{ duration: ${durationMs / 1000}, ease: [${numbers.join(", ")}] }}`,
  },
];

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function CodeExport({ curve, durationMs }) {
  const [activeFormatName, setActiveFormatName] = useState(FORMATS[0].name);
  const [copyStatus, setCopyStatus] = useState("idle");

  const activeFormat = FORMATS.find((format) => format.name === activeFormatName);
  const snippet = activeFormat.build(curve.map(formatCurveNumber), durationMs);

  useEffect(() => {
    if (copyStatus === "idle") return undefined;
    const timeoutId = setTimeout(() => setCopyStatus("idle"), 1600);
    return () => clearTimeout(timeoutId);
  }, [copyStatus]);

  const handleCopy = async () => {
    setCopyStatus((await copyText(snippet)) ? "copied" : "failed");
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-ink bg-ink text-surface shadow-[3px_3px_0_var(--orb)]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2 py-1.5">
        <div role="tablist" aria-label="Code format" className="flex gap-0.5">
          {FORMATS.map((format) => {
            const isActive = format.name === activeFormatName;
            return (
              <button
                key={format.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormatName(format.name)}
                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[12px] transition-colors ${
                  isActive ? "bg-white/15 text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {format.name}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`shrink-0 cursor-pointer rounded-full px-3 py-0.5 text-[12px] font-bold transition-colors ${
            copyStatus === "copied" ? "bg-electric text-ink" : "bg-white text-ink hover:bg-electric"
          }`}
        >
          <span aria-live="polite">
            {copyStatus === "copied" ? "Copied ✓" : copyStatus === "failed" ? "Copy failed" : "Copy"}
          </span>
        </button>
      </div>
      {/* Wraps instead of scrolling so the full snippet fits the narrow curve column. */}
      <pre className="m-0 px-3 py-2.5 font-mono text-[12px] leading-[1.55] break-words whitespace-pre-wrap text-white/90">
        {/* Each token is unbreakable, so lines wrap only at spaces (never at "cubic-bezier"'s hyphen). */}
        <code>
          {snippet.split(/(\s+)/).map((token, index) =>
            /^\s+$/.test(token) ? token : (
              <span key={index} className="whitespace-nowrap">
                {token}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}

// Memoized: its props stay the same while the loop animates.
export default memo(CodeExport);
