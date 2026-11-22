import { useMemo, useRef } from "react";
import CurveHandle from "./CurveHandle.jsx";
import CatchOrb from "../theme/CatchOrb.jsx";

const PLOT_SIZE = 200;
const PAD_LEFT = 34;
const PAD_RIGHT = 44;
const PAD_Y = 16;
const Y_MIN = -0.6;
const Y_MAX = 1.6;
const VIEW_WIDTH = PAD_LEFT + PLOT_SIZE + PAD_RIGHT;
const VIEW_HEIGHT = (Y_MAX - Y_MIN) * PLOT_SIZE + PAD_Y * 2;
const VALUE_TRACK_X = PAD_LEFT + PLOT_SIZE + 26;

const toSvgX = (x) => PAD_LEFT + x * PLOT_SIZE;
const toSvgY = (y) => PAD_Y + (Y_MAX - y) * PLOT_SIZE;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const roundToHundredths = (value) => Math.round(value * 100) / 100;
const GRID_STEPS = [0.25, 0.5, 0.75];

export default function CurveEditor({ curve, onChange, onChangeEnd, playhead }) {
  const svgRef = useRef(null);
  const [x1, y1, x2, y2] = curve;

  const moveHandle = (handleIndex, x, y) => {
    const nextCurve = [...curve];
    nextCurve[handleIndex * 2] = roundToHundredths(clamp(x, 0, 1));
    nextCurve[handleIndex * 2 + 1] = roundToHundredths(clamp(y, Y_MIN, Y_MAX));
    onChange(nextCurve);
  };

  // Map the pointer into viewBox units via the SVG's own transform, so it stays
  // accurate when the chart is letterboxed to fit a short container.
  const moveHandleToPointer = (handleIndex, event) => {
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x: svgX, y: svgY } = point.matrixTransform(svg.getScreenCTM().inverse());
    moveHandle(handleIndex, (svgX - PAD_LEFT) / PLOT_SIZE, Y_MAX - (svgY - PAD_Y) / PLOT_SIZE);
  };

  const nudgeHandle = (handleIndex, deltaX, deltaY) => {
    moveHandle(handleIndex, curve[handleIndex * 2] + deltaX, curve[handleIndex * 2 + 1] + deltaY);
  };

  const curvePath = `M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(
    x2
  )} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`;

  // Everything except the playhead depends only on the curve (and the handlers
  // built from it), so it's memoized: while the loop plays, React reuses these
  // elements and only diffs the playhead.
  const chartLayers = useMemo(() => (
    <>
      <defs>
        <pattern id="overshoot-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="stroke-border-strong" strokeWidth="1.5" />
        </pattern>
      </defs>

      <rect x={toSvgX(0)} y={toSvgY(Y_MAX)} width={PLOT_SIZE} height={toSvgY(1) - toSvgY(Y_MAX)} fill="url(#overshoot-hatch)" />
      <rect x={toSvgX(0)} y={toSvgY(0)} width={PLOT_SIZE} height={toSvgY(Y_MIN) - toSvgY(0)} fill="url(#overshoot-hatch)" />
      <text x={toSvgX(1) - 6} y={toSvgY(Y_MAX) + 14} textAnchor="end" className="fill-muted text-[9px] uppercase tracking-[0.12em]">
        Overshoot
      </text>
      <text x={toSvgX(1) - 6} y={toSvgY(Y_MIN) - 8} textAnchor="end" className="fill-muted text-[9px] uppercase tracking-[0.12em]">
        Undershoot
      </text>

      <rect x={toSvgX(0)} y={toSvgY(1)} width={PLOT_SIZE} height={PLOT_SIZE} className="fill-surface stroke-border-strong" />
      {GRID_STEPS.map((step) => (
        <g key={step} className="stroke-border-strong" strokeDasharray="2 4">
          <line x1={toSvgX(step)} y1={toSvgY(0)} x2={toSvgX(step)} y2={toSvgY(1)} />
          <line x1={toSvgX(0)} y1={toSvgY(step)} x2={toSvgX(1)} y2={toSvgY(step)} />
        </g>
      ))}

      <text x={toSvgX(0)} y={toSvgY(0) + 13} className="fill-muted text-[9px] uppercase tracking-[0.12em]">
        Time →
      </text>
      <text
        x={toSvgX(0) - 10}
        y={toSvgY(0)}
        transform={`rotate(-90 ${toSvgX(0) - 10} ${toSvgY(0)})`}
        className="fill-muted text-[9px] uppercase tracking-[0.12em]"
      >
        Progress →
      </text>

      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(1)}
        y2={toSvgY(1)}
        className="stroke-muted"
        strokeOpacity="0.35"
        strokeDasharray="4 4"
      />

      <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(x1)} y2={toSvgY(y1)} className="stroke-accent" strokeWidth="1.5" />
      <line x1={toSvgX(1)} y1={toSvgY(1)} x2={toSvgX(x2)} y2={toSvgY(y2)} className="stroke-tertiary" strokeWidth="1.5" />

      <path d={curvePath} fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />

      <line
        x1={VALUE_TRACK_X}
        y1={toSvgY(Y_MIN + 0.1)}
        x2={VALUE_TRACK_X}
        y2={toSvgY(Y_MAX - 0.1)}
        className="stroke-border-strong"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line x1={VALUE_TRACK_X} y1={toSvgY(0)} x2={VALUE_TRACK_X} y2={toSvgY(1)} className="stroke-ink/15" strokeWidth="4" strokeLinecap="round" />
    </>
  ), [curvePath, x1, y1, x2, y2]);

  const handleLayers = useMemo(() => (
    <>
      <circle cx={toSvgX(0)} cy={toSvgY(0)} r="3.5" className="fill-ink" />
      <circle cx={toSvgX(1)} cy={toSvgY(1)} r="3.5" className="fill-ink" />

      <CurveHandle
        label="First control point"
        cx={toSvgX(x1)}
        cy={toSvgY(y1)}
        x={x1}
        y={y1}
        colorClassName="stroke-accent"
        onPointerDrag={(event) => moveHandleToPointer(0, event)}
        onNudge={(deltaX, deltaY) => nudgeHandle(0, deltaX, deltaY)}
        onDragEnd={onChangeEnd}
      />
      <CurveHandle
        label="Second control point"
        cx={toSvgX(x2)}
        cy={toSvgY(y2)}
        x={x2}
        y={y2}
        colorClassName="stroke-tertiary"
        onPointerDrag={(event) => moveHandleToPointer(1, event)}
        onNudge={(deltaX, deltaY) => nudgeHandle(1, deltaX, deltaY)}
        onDragEnd={onChangeEnd}
      />
    </>
  ), [x1, y1, x2, y2, onChange, onChangeEnd]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="block h-auto w-full touch-none select-none lg:h-full"
      role="group"
      aria-label="Cubic bezier curve editor"
    >
      {chartLayers}

      {playhead && (
        <g>
          <line
            x1={toSvgX(playhead.time)}
            y1={toSvgY(playhead.progress)}
            x2={VALUE_TRACK_X}
            y2={toSvgY(playhead.progress)}
            className="stroke-ink/25"
            strokeDasharray="2 3"
          />
          <circle cx={toSvgX(playhead.time)} cy={toSvgY(playhead.progress)} r="5" className="fill-ink" />
          <CatchOrb x={VALUE_TRACK_X - 9} y={toSvgY(playhead.progress) - 9} width="18" height="18" />
        </g>
      )}

      {handleLayers}
    </svg>
  );
}
