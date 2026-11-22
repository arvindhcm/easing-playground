import { useMemo, useState } from "react";
import CurveEditor from "./components/CurveEditor.jsx";
import CurveInputs from "./components/CurveInputs.jsx";
import PresetPicker from "./components/PresetPicker.jsx";
import PlaybackControls from "./components/PlaybackControls.jsx";
import CodeExport from "./components/CodeExport.jsx";
import PositionDemo from "./demos/PositionDemo.jsx";
import ToastDemo from "./demos/ToastDemo.jsx";
import ModalDemo from "./demos/ModalDemo.jsx";
import ReorderDemo from "./demos/ReorderDemo.jsx";
import { createBezierEasing } from "./lib/cubicBezier.js";
import { PRESETS, findMatchingPreset } from "./lib/presets.js";
import { useLoopingTimeline } from "./lib/useLoopingTimeline.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const [curve, setCurve] = useState(PRESETS[0].curve);
  const [durationMs, setDurationMs] = useState(500);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [restartToken, setRestartToken] = useState(0);

  const easing = useMemo(() => createBezierEasing(...curve), [curve]);
  const { direction, linearProgress } = useLoopingTimeline({ durationMs, isPlaying, restartToken });

  const easedProgress = easing(linearProgress);
  const value = direction === "in" ? easedProgress : 1 - easedProgress;
  const linearValue = direction === "in" ? linearProgress : 1 - linearProgress;
  const activePreset = findMatchingPreset(curve);

  const replay = () => {
    setRestartToken((token) => token + 1);
    setIsPlaying(true);
  };

  const selectPreset = (preset) => {
    setCurve(preset.curve);
    replay();
  };

  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-14 pb-16 sm:px-8 max-[560px]:pt-10">
      <header className="max-w-[640px]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.16em] text-accent-ink">Motion tool</p>
        <h1 className="m-0 mt-2 text-[clamp(32px,5vw,48px)] leading-[1.05] font-bold tracking-[-0.02em]">
          Easing Playground
        </h1>
        <p className="m-0 mt-4 text-[16px] leading-[1.65] text-muted">
          Drag the handles to shape a curve. The same curve drives real interface moments — a
          toast, a modal, a reorder — then copy it straight into your code.
        </p>
      </header>

      <div className="mt-10 grid items-start gap-5 lg:grid-cols-[minmax(300px,380px)_1fr]">
        <section
          aria-label="Curve"
          className="rounded-3xl border border-border-strong bg-surface p-5 lg:sticky lg:top-6"
        >
          <CurveEditor
            curve={curve}
            onChange={setCurve}
            playhead={isPlaying ? { time: linearProgress, progress: easedProgress } : null}
          />
          <div className="mt-4">
            <CurveInputs curve={curve} onChange={setCurve} />
          </div>
        </section>

        <section aria-label="Preview" className="min-w-0 space-y-5">
          <div className="rounded-3xl border border-border-strong bg-surface p-5">
            <PresetPicker activePreset={activePreset} onSelect={selectPreset} />
            <div className="mt-4 border-t border-border-strong pt-4">
              <PlaybackControls
                isPlaying={isPlaying}
                onTogglePlaying={() => setIsPlaying((playing) => !playing)}
                onReplay={replay}
                durationMs={durationMs}
                onDurationChange={setDurationMs}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PositionDemo value={value} linearValue={linearValue} />
            <ToastDemo value={value} />
            <ModalDemo value={value} />
            <ReorderDemo value={value} />
          </div>

          <CodeExport curve={curve} durationMs={durationMs} />
        </section>
      </div>
    </main>
  );
}
