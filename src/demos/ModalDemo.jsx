import DemoFrame from "./DemoFrame.jsx";
import Creature from "../theme/Creature.jsx";
import { useDemoMotion } from "../lib/useDemoMotion.js";

const clampUnit = (value) => Math.min(1, Math.max(0, value));

export default function ModalDemo({ motion }) {
  const { value, isOn, toggle } = useDemoMotion(motion);
  const visibility = clampUnit(value);

  return (
    <DemoFrame title="Modal" caption="tap the grass">
      {/* Tall grass behind the encounter — rustling it opens the modal. */}
      <button
        type="button"
        onClick={toggle}
        disabled={isOn}
        aria-label="Search the tall grass"
        className="absolute inset-0 flex cursor-pointer items-start justify-center pt-6 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink"
      >
        <span className="rounded-full bg-surface/80 px-3 py-1 text-[11px] font-bold text-ink-soft">
          Search the grass
        </span>
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[repeating-linear-gradient(100deg,#5cbf5a_0_6px,#4cae4b_6px_12px)]" />
      <div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: visibility * 0.32 }} />
      <div className={`absolute inset-0 grid place-items-center ${isOn ? "" : "pointer-events-none"}`}>
        <div
          role="dialog"
          aria-hidden={!isOn}
          aria-label="Wild encounter"
          className="w-[72%] rounded-xl border-2 border-ink bg-surface p-3 shadow-[3px_3px_0_var(--ink)]"
          style={{
            opacity: visibility,
            transform: `translateY(${(1 - value) * 18}px) scale(${0.82 + value * 0.18})`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <Creature kind="embercub" className="size-11 shrink-0" />
            <div className="text-[12.5px] leading-[1.35] text-ink">
              A wild <span className="font-bold">Embercub</span> appeared!
            </div>
          </div>
          <div className="mt-2.5 flex justify-end gap-1.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={toggle}
              tabIndex={isOn ? 0 : -1}
              className="cursor-pointer rounded-full bg-ink/10 px-2.5 py-1 text-ink-soft"
            >
              Run
            </button>
            <button
              type="button"
              onClick={toggle}
              tabIndex={isOn ? 0 : -1}
              className="cursor-pointer rounded-full bg-accent px-3 py-1 text-white"
            >
              Catch
            </button>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
