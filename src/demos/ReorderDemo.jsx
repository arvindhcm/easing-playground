import DemoFrame from "./DemoFrame.jsx";

const ROW_STEP_PX = 36;
const ROWS = ["Inbox", "Drafts", "Sent", "Starred"];
const MOVING_ROW_INDEX = ROWS.length - 1;

export default function ReorderDemo({ value }) {
  return (
    <DemoFrame title="Reorder" caption="pin to top">
      <div className="absolute inset-x-5 top-[17px]">
        {ROWS.map((label, index) => {
          const isMovingRow = index === MOVING_ROW_INDEX;
          const offsetPx = isMovingRow
            ? index * ROW_STEP_PX * (1 - value)
            : index * ROW_STEP_PX + ROW_STEP_PX * value;

          return (
            <div
              key={label}
              className={`absolute inset-x-0 flex h-[30px] items-center gap-2.5 rounded-lg px-3 text-[13px] ${
                isMovingRow ? "z-10 bg-accent-soft font-bold text-accent-ink shadow-sm" : "bg-surface text-ink-soft"
              }`}
              style={{ transform: `translateY(${offsetPx}px)` }}
            >
              <span className={`size-1.5 rounded-full ${isMovingRow ? "bg-accent" : "bg-ink/20"}`} />
              {label}
              {isMovingRow && <span className="ml-auto">★</span>}
            </div>
          );
        })}
      </div>
    </DemoFrame>
  );
}
