import { PRESETS } from "../lib/presets.js";

export default function PresetPicker({ activePreset, onSelect }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isActive = activePreset?.name === preset.name;
          return (
            <button
              key={preset.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(preset)}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-ink bg-ink text-surface"
                  : "border-border-strong bg-surface text-ink-soft hover:border-ink/30"
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[3.2em] max-w-[560px] text-[14.5px] leading-[1.6] text-muted">
        {activePreset ? (
          <>
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
