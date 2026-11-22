import { useEffect, useRef, useState } from "react";
import DemoFrame from "./DemoFrame.jsx";
import Creature from "../theme/Creature.jsx";
import { CREATURES } from "../theme/creatures.js";
import { useLoopHandoff } from "../lib/useDemoMotion.js";
import { prefersReducedMotion } from "../lib/motionPreference.js";

const ROW_STEP_PX = 36;
const ROWS = ["drizzlet", "sproutle", "embercub", "sparkit"];
const LOOP_MOVER = "sparkit";
// How far (in rows) the dragged row may be pulled past either end.
const DRAG_OVERSCROLL = 0.35;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const moveItem = (list, item, toIndex) => {
  const rest = list.filter((other) => other !== item);
  return [...rest.slice(0, toIndex), item, ...rest.slice(toIndex)];
};

// Slot positions (in rows, fractional mid-move) while the loop drives:
// Sparkit swims from the back to the front and back again.
function loopSlots(value) {
  return Object.fromEntries(
    ROWS.map((kind, index) => [kind, kind === LOOP_MOVER ? index * (1 - value) : index + value]),
  );
}

// Drag to reorder. The dragged row follows the pointer 1:1; every other row
// eases to its new slot with the current curve and duration, and the dropped
// row eases from where it was let go into place.
export default function ReorderDemo({ motion }) {
  const { loopValue, easing, durationMs, onInteract } = motion;

  // Once the user grabs a row: { order, active, dragSlot } (dragSlot is null when not dragging).
  const [local, setLocal] = useState(null);
  const [now, setNow] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const tweensRef = useRef({}); // kind → { from, to, start }
  const dragRef = useRef(null); // { kind, startY, startSlot }
  const frameRef = useRef(null);
  const durationRef = useRef(durationMs);
  durationRef.current = durationMs;

  const stopTicking = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  };
  useEffect(() => stopTicking, []);

  useLoopHandoff(motion, () => {
    stopTicking();
    tweensRef.current = {};
    dragRef.current = null;
    setLocal(null);
  });

  // Re-render every frame while any row is still easing, then go idle.
  const tick = () => {
    const time = performance.now();
    setNow(time);
    const isEasing = Object.values(tweensRef.current).some(
      (tween) => time - tween.start < durationRef.current,
    );
    frameRef.current = isEasing ? requestAnimationFrame(tick) : null;
  };
  const startTicking = () => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(tick);
  };

  const easedSlot = (kind, order, time) => {
    const tween = tweensRef.current[kind];
    const target = order.indexOf(kind);
    if (!tween || prefersReducedMotion || durationMs <= 0) return target;
    const t = (time - tween.start) / durationMs;
    if (t >= 1) return tween.to;
    if (t <= 0) return tween.from;
    return tween.from + (tween.to - tween.from) * easing(t);
  };

  const slotsAt = (time) => {
    if (!local) return loopSlots(loopValue);
    return Object.fromEntries(
      ROWS.map((kind) => [
        kind,
        kind === dragRef.current?.kind && local.dragSlot !== null
          ? local.dragSlot
          : easedSlot(kind, local.order, time),
      ]),
    );
  };

  const slots = slotsAt(now);
  const order = local ? local.order : [...ROWS].sort((a, b) => slots[a] - slots[b]);
  const active = local ? local.active : LOOP_MOVER;

  // Ease every row whose slot changed from wherever it is right now.
  const retarget = (nextOrder, fromSlots, except) => {
    const start = performance.now();
    for (const kind of ROWS) {
      if (kind === except) continue;
      const to = nextOrder.indexOf(kind);
      if (Math.abs(fromSlots[kind] - to) > 0.001) {
        tweensRef.current[kind] = { from: fromSlots[kind], to, start };
      }
    }
    startTicking();
  };

  const announce = (kind, nextOrder) =>
    setAnnouncement(`${CREATURES[kind].name} moved to position ${nextOrder.indexOf(kind) + 1} of ${ROWS.length}.`);

  const handlePointerDown = (kind, event) => {
    if (event.button !== 0) return;
    onInteract?.();
    event.currentTarget.setPointerCapture(event.pointerId);

    const currentSlots = slotsAt(performance.now());
    const currentOrder = local ? local.order : [...ROWS].sort((a, b) => currentSlots[a] - currentSlots[b]);
    dragRef.current = { kind, startY: event.clientY, startSlot: currentSlots[kind] };
    delete tweensRef.current[kind];
    // Coming from the loop, settle the other rows into whole slots.
    retarget(currentOrder, currentSlots, kind);
    setLocal({ order: currentOrder, active: kind, dragSlot: currentSlots[kind] });
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || !local) return;
    const dragSlot = clamp(
      drag.startSlot + (event.clientY - drag.startY) / ROW_STEP_PX,
      -DRAG_OVERSCROLL,
      ROWS.length - 1 + DRAG_OVERSCROLL,
    );
    const targetIndex = clamp(Math.round(dragSlot), 0, ROWS.length - 1);
    let nextOrder = local.order;
    if (targetIndex !== local.order.indexOf(drag.kind)) {
      nextOrder = moveItem(local.order, drag.kind, targetIndex);
      retarget(nextOrder, slotsAt(performance.now()), drag.kind);
    }
    setLocal({ ...local, order: nextOrder, dragSlot });
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    if (!drag || !local) return;
    dragRef.current = null;
    const to = local.order.indexOf(drag.kind);
    tweensRef.current[drag.kind] = { from: local.dragSlot, to, start: performance.now() };
    startTicking();
    setLocal({ ...local, dragSlot: null });
    announce(drag.kind, local.order);
  };

  // Keyboard: arrow keys move the focused row one slot.
  const handleKeyDown = (kind, event) => {
    const step = { ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    onInteract?.();
    const currentSlots = slotsAt(performance.now());
    const currentOrder = local ? local.order : [...ROWS].sort((a, b) => currentSlots[a] - currentSlots[b]);
    const targetIndex = clamp(currentOrder.indexOf(kind) + step, 0, ROWS.length - 1);
    const nextOrder = moveItem(currentOrder, kind, targetIndex);
    retarget(nextOrder, currentSlots);
    setLocal({ order: nextOrder, active: kind, dragSlot: null });
    announce(kind, nextOrder);
  };

  const draggingKind = local?.dragSlot !== null ? dragRef.current?.kind : null;

  return (
    <DemoFrame title="Reorder" caption="drag to reorder">
      {/* Vertically centered: the list is ROWS.length slots tall, minus the gap under the last row. */}
      <div
        role="list"
        aria-label="Party order"
        className="absolute inset-x-5"
        style={{ top: `calc(50% - ${(ROWS.length * ROW_STEP_PX - 6) / 2}px)` }}
      >
        {/* Stable DOM order: moving nodes mid-drag would drop pointer capture. */}
        {ROWS.map((kind) => {
          const isActive = kind === active;
          const isDragging = kind === draggingKind;
          const isLeader = order[0] === kind;
          const { name } = CREATURES[kind];

          return (
            <div
              key={kind}
              role="listitem"
              tabIndex={0}
              aria-label={`${name}, position ${order.indexOf(kind) + 1} of ${ROWS.length}. Drag, or use the up and down arrow keys, to reorder.`}
              onPointerDown={(event) => handlePointerDown(kind, event)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={(event) => handleKeyDown(kind, event)}
              className={`absolute inset-x-0 flex h-[30px] touch-none items-center gap-2 rounded-lg border-2 px-2 text-[13px] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                isDragging ? "z-20 cursor-grabbing" : "cursor-grab"
              } ${
                isActive
                  ? "z-10 border-ink bg-electric/40 font-bold text-ink"
                  : "border-transparent bg-surface text-ink-soft hover:border-ink/20"
              } ${isDragging ? "shadow-[2px_3px_0_var(--ink)]" : isActive ? "shadow-sm" : ""}`}
              style={{
                transform: `translateY(${slots[kind] * ROW_STEP_PX}px) scale(${isDragging ? 1.03 : 1})`,
              }}
            >
              <Creature kind={kind} className="pointer-events-none size-6 shrink-0" />
              {name}
              <span className="ml-auto flex items-center gap-2 text-ink-soft">
                {isLeader && <span className="text-ink">★</span>}
                {/* Grip affordance */}
                <svg viewBox="0 0 8 12" className="h-3 w-2 fill-current opacity-40" aria-hidden="true">
                  <circle cx="2" cy="2" r="1.1" /><circle cx="6" cy="2" r="1.1" />
                  <circle cx="2" cy="6" r="1.1" /><circle cx="6" cy="6" r="1.1" />
                  <circle cx="2" cy="10" r="1.1" /><circle cx="6" cy="10" r="1.1" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </DemoFrame>
  );
}
