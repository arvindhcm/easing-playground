import DemoFrame from "./DemoFrame.jsx";

export default function ToastDemo({ value }) {
  return (
    <DemoFrame title="Toast" caption="slides up">
      <div className="space-y-2 p-4">
        <div className="h-2.5 w-2/5 rounded-full bg-ink/10" />
        <div className="h-2.5 w-4/5 rounded-full bg-ink/[0.06]" />
        <div className="h-2.5 w-3/5 rounded-full bg-ink/[0.06]" />
      </div>
      <div
        className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl bg-ink px-3.5 py-3 text-surface shadow-lg"
        style={{ transform: `translateY(${(1 - value) * 150}%)` }}
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-ink">
          ✓
        </span>
        <span className="text-[13px]">Changes saved</span>
        <span className="ml-auto text-[12px] font-bold text-accent">Undo</span>
      </div>
    </DemoFrame>
  );
}
