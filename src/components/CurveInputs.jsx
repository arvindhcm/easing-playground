const FIELDS = [
  { label: "x1", min: 0, max: 1, dotClassName: "bg-accent" },
  { label: "y1", min: -0.6, max: 1.6, dotClassName: "bg-accent" },
  { label: "x2", min: 0, max: 1, dotClassName: "bg-tertiary" },
  { label: "y2", min: -0.6, max: 1.6, dotClassName: "bg-tertiary" },
];

export default function CurveInputs({ curve, onChange }) {
  const updateValue = (index, rawValue) => {
    const parsed = Number.parseFloat(rawValue);
    if (!Number.isFinite(parsed)) return;
    const { min, max } = FIELDS[index];
    const nextCurve = [...curve];
    nextCurve[index] = Math.min(max, Math.max(min, parsed));
    onChange(nextCurve);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {FIELDS.map((field, index) => (
        <label key={field.label} className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
            <span className={`size-1.5 rounded-full ${field.dotClassName}`} />
            {field.label}
          </span>
          <input
            type="number"
            step="0.01"
            min={field.min}
            max={field.max}
            value={curve[index]}
            onChange={(event) => updateValue(index, event.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface-alt px-2 py-1.5 font-mono text-[13px] text-ink outline-none transition-colors focus:border-ink/40 focus:bg-surface"
          />
        </label>
      ))}
    </div>
  );
}
