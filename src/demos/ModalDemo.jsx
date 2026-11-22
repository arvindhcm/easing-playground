import DemoFrame from "./DemoFrame.jsx";

const clampUnit = (value) => Math.min(1, Math.max(0, value));

export default function ModalDemo({ value }) {
  const visibility = clampUnit(value);

  return (
    <DemoFrame title="Modal" caption="scales in">
      <div className="absolute inset-0 bg-ink" style={{ opacity: visibility * 0.28 }} />
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="w-[62%] rounded-xl bg-surface p-3.5 shadow-xl"
          style={{
            opacity: visibility,
            transform: `translateY(${(1 - value) * 18}px) scale(${0.82 + value * 0.18})`,
          }}
        >
          <div className="h-2.5 w-1/2 rounded-full bg-ink/80" />
          <div className="mt-2.5 h-2 w-full rounded-full bg-ink/10" />
          <div className="mt-1.5 h-2 w-4/5 rounded-full bg-ink/10" />
          <div className="mt-3.5 flex justify-end gap-1.5">
            <div className="h-5 w-12 rounded-full bg-ink/10" />
            <div className="h-5 w-14 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
