import DemoFrame from "./DemoFrame.jsx";
import CatchOrb from "../theme/CatchOrb.jsx";
import { useDemoMotion } from "../lib/useDemoMotion.js";

export default function ToastDemo({ motion }) {
  const { value, isOn, toggle } = useDemoMotion(motion);

  return (
    <DemoFrame title="Toast" caption="tap to throw">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-3/5 rounded-full bg-ink/10" />
          <div className="h-2.5 w-full rounded-full bg-ink/[0.06]" />
          <div className="h-2.5 w-4/5 rounded-full bg-ink/[0.06]" />
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isOn}
          className="shrink-0 cursor-pointer rounded-full border-2 border-ink bg-accent px-3 py-1 text-[11px] font-bold text-white shadow-[2px_2px_0_var(--ink)] transition-transform active:scale-95"
        >
          {isOn ? "Dismiss" : "Throw"}
        </button>
      </div>
      <div
        role="status"
        className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border-2 border-ink bg-ink px-3.5 py-3 text-surface shadow-lg"
        style={{ transform: `translateY(${(1 - value) * 150}%)` }}
      >
        <CatchOrb className="size-6 shrink-0" />
        <span className="text-[13px]">Sparkit was caught!</span>
        <span className="ml-auto text-[12px] font-bold text-electric">Nickname</span>
      </div>
    </DemoFrame>
  );
}
