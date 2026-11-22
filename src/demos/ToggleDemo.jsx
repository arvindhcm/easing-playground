import DemoFrame from "./DemoFrame.jsx";
import Creature from "../theme/Creature.jsx";
import { useDemoMotion } from "../lib/useDemoMotion.js";

const clampUnit = (value) => Math.min(1, Math.max(0, value));

// Track is 48×28 with a 24px knob and 2px inset, so the knob travels 20px.
const KNOB_TRAVEL_PX = 20;

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

function Switch({ motion, label }) {
  const { value, isOn, toggle } = useDemoMotion(motion);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={toggle}
      className="shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <AnimatedToggle value={value} />
    </button>
  );
}

// The top switch is always the user's: it starts on and ignores the loop.
const userOnly = (motion) => ({ ...motion, loopValue: 1, isPlaying: false, onInteract: undefined });

function Row({ kind, labelWidth, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <Creature kind={kind} className="size-8 shrink-0" />
        <div className="space-y-1.5">
          <div className="h-2.5 rounded-full bg-ink/70" style={{ width: labelWidth }} />
          <div className="h-2 w-20 rounded-full bg-ink/10" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ToggleDemo({ motion }) {
  return (
    <DemoFrame title="Toggle" caption="tap a switch">
      <div className="flex h-full items-center px-4">
        <div className="w-full divide-y divide-border-strong rounded-xl border-2 border-ink bg-surface">
          <Row kind="drizzlet" labelWidth={56}>
            <Switch motion={userOnly(motion)} label="Drizzlet notifications" />
          </Row>
          <Row kind="sparkit" labelWidth={76}>
            <Switch motion={motion} label="Sparkit notifications" />
          </Row>
        </div>
      </div>
    </DemoFrame>
  );
}
