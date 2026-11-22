const ARROW_DIRECTIONS = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

export default function CurveHandle({ label, cx, cy, x, y, colorClassName, onPointerDrag, onNudge, onDragEnd }) {
  const handleKeyDown = (event) => {
    const direction = ARROW_DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 0.1 : 0.01;
    onNudge(direction[0] * step, direction[1] * step);
  };

  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${label}: x ${x}, y ${y}. Drag, or use arrow keys to move.`}
      className="group cursor-grab outline-none active:cursor-grabbing"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onPointerDrag(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) onPointerDrag(event);
      }}
      // Fires on pointer up or cancel, once the drag lets go.
      onLostPointerCapture={() => onDragEnd?.()}
      onKeyDown={handleKeyDown}
      onKeyUp={(event) => {
        if (ARROW_DIRECTIONS[event.key]) onDragEnd?.();
      }}
    >
      <circle cx={cx} cy={cy} r="20" fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r="12"
        fill="none"
        strokeWidth="5"
        className={`${colorClassName} opacity-0 transition-opacity group-hover:opacity-25 group-focus-visible:opacity-40`}
      />
      <circle cx={cx} cy={cy} r="7" strokeWidth="3" className={`fill-surface ${colorClassName}`} />
    </g>
  );
}
