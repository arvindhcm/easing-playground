import { useEffect, useState } from "react";
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

export default function CodeExport({ curve, durationMs }) {
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
    <div className="overflow-hidden rounded-2xl bg-ink text-surface">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5">
        <div role="tablist" aria-label="Code format" className="flex gap-1">
          {FORMATS.map((format) => {
            const isActive = format.name === activeFormatName;
            return (
              <button
                key={format.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormatName(format.name)}
                className={`cursor-pointer rounded-full px-3 py-1 text-[13px] transition-colors ${
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
          className={`cursor-pointer rounded-full px-3.5 py-1 text-[13px] font-bold transition-colors ${
            copyStatus === "copied" ? "bg-accent text-ink" : "bg-white text-ink hover:bg-accent-soft"
          }`}
        >
          <span aria-live="polite">
            {copyStatus === "copied" ? "Copied ✓" : copyStatus === "failed" ? "Copy failed" : "Copy"}
          </span>
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.6] text-white/90">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
