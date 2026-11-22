import DemoFrame from "./DemoFrame.jsx";

const clampUnit = (value) => Math.min(1, Math.max(0, value));

// Track is 48×28 with a 24px knob and 2px inset, so the knob travels 20px.
const KNOB_TRAVEL_PX = 20;

function StaticToggle({ on }) {
  return (
    <div className={`relative h-7 w-12 shrink-0 rounded-full ${on ? "bg-accent" : "bg-ink/10"}`}>
      <div
        className="absolute top-0.5 left-0.5 size-6 rounded-full bg-surface shadow-[0_1px_3px_rgba(13,13,13,0.2)]"
        style={{ transform: `translateX(${on ? KNOB_TRAVEL_PX : 0}px)` }}
      />
    </div>
  );
}

function AnimatedToggle({ value }) {
  return (
    <div className="relative h-7 w-12 shrink-0 overflow-hidden rounded-full bg-ink/10">
      {/* Color fades with the clamped value; the knob uses the raw value so overshoot curves visibly overshoot. */}
      <div className="absolute inset-0 bg-accent" style={{ opacity: clampUnit(value) }} />
      <div
        className="absolute top-0.5 left-0.5 size-6 rounded-full bg-surface shadow-[0_1px_3px_rgba(13,13,13,0.2)]"
        style={{ transform: `translateX(${value * KNOB_TRAVEL_PX}px)` }}
      />
    </div>
  );
}

function Row({ labelWidth, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="space-y-1.5">
        <div className="h-2.5 rounded-full bg-ink/70" style={{ width: labelWidth }} />
        <div className="h-2 w-24 rounded-full bg-ink/10" />
      </div>
      {children}
    </div>
  );
}

export default function ToggleDemo({ value }) {
  return (
    <DemoFrame title="Toggle" caption="switches on">
      <div className="flex h-full items-center px-4">
        <div className="w-full divide-y divide-border-strong rounded-xl bg-surface shadow-sm">
          <Row labelWidth={64}>
            <StaticToggle on />
          </Row>
          <Row labelWidth={88}>
            <AnimatedToggle value={value} />
          </Row>
        </div>
      </div>
    </DemoFrame>
  );
}
