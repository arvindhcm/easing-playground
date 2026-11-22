import { memo } from "react";
import { PRESETS } from "../lib/presets.js";
import { TYPE_COLORS } from "../theme/creatures.js";

function TypeBadge({ type }) {
  return (
    <span
      className="mr-1.5 inline-block rounded-full px-2 py-0.5 align-[1px] text-[10.5px] font-bold tracking-[0.08em] text-white uppercase [text-shadow:0_1px_0_rgba(0,0,0,0.25)]"
      style={{ background: TYPE_COLORS[type] }}
    >
      {type}
    </span>
  );
}

function PresetPicker({ activePreset, onSelect }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 lg:gap-1">
        {PRESETS.map((preset) => {
          const isActive = activePreset?.name === preset.name;
          return (
            <button
              key={preset.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(preset)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm transition-colors lg:gap-1.5 lg:px-2.5 lg:py-1 lg:text-[12.5px] ${
                isActive
                  ? "border-ink bg-ink text-surface"
                  : "border-border-strong bg-surface text-ink-soft hover:border-ink/40"
              }`}
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full ring-2 ring-white/70"
                style={{ background: TYPE_COLORS[preset.type] }}
              />
              {preset.name}
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[3.2em] max-w-[620px] text-[14.5px] leading-[1.6] text-muted lg:mt-2 lg:text-[13px]">
        {activePreset ? (
          <>
            <TypeBadge type={activePreset.type} />
            <span className="font-bold text-ink">{activePreset.name}.</span> {activePreset.guidance}
          </>
        ) : (
          <>
            <span className="font-bold text-ink">Custom.</span> Your own curve — steeper sections move
            faster, flat sections linger.
          </>
        )}
      </p>
    </div>
  );
}

// Memoized: its props stay the same while the loop animates.
export default memo(PresetPicker);
