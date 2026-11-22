import DemoFrame from "./DemoFrame.jsx";

function Track({ label, progress, dotClassName }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="relative h-7 rounded-full bg-ink/[0.06]">
        <div
          className={`absolute top-1 size-5 rounded-full ${dotClassName}`}
          style={{ left: `calc(4px + ${progress} * (100% - 28px))` }}
        />
      </div>
    </div>
  );
}

export default function PositionDemo({ value, linearValue }) {
  return (
    <DemoFrame title="Position" caption="vs. linear">
      <div className="flex h-full flex-col justify-center gap-5 px-5">
        <Track label="Linear" progress={linearValue} dotClassName="bg-ink/25" />
        <Track label="Your curve" progress={value} dotClassName="bg-accent shadow-[0_2px_8px_rgba(255,142,60,0.45)]" />
      </div>
    </DemoFrame>
  );
}
