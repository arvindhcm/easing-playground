import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CurveEditor from "./components/CurveEditor.jsx";
import CurveInputs from "./components/CurveInputs.jsx";
import PresetPicker from "./components/PresetPicker.jsx";
import PlaybackControls from "./components/PlaybackControls.jsx";
import CodeExport from "./components/CodeExport.jsx";
import ToggleDemo from "./demos/ToggleDemo.jsx";
import ToastDemo from "./demos/ToastDemo.jsx";
import ModalDemo from "./demos/ModalDemo.jsx";
import ReorderDemo from "./demos/ReorderDemo.jsx";
import { createBezierEasing } from "./lib/cubicBezier.js";
import { PRESETS, findMatchingPreset } from "./lib/presets.js";
import { useLoopingTimeline } from "./lib/useLoopingTimeline.js";
import { prefersReducedMotion } from "./lib/motionPreference.js";
import Backdrop from "./theme/Backdrop.jsx";
import CatchOrb from "./theme/CatchOrb.jsx";
import Creature from "./theme/Creature.jsx";

const PARTY = ["sparkit", "embercub", "drizzlet", "sproutle"];

export default function App() {
  const [curve, setCurve] = useState(PRESETS[0].curve);
  const [durationMs, setDurationMs] = useState(500);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [restartToken, setRestartToken] = useState(0);
  // Preview mode plays a single cycle, then pauses so the user can drive. It runs
  // on load and whenever the curve changes while paused.
  const [isPreview, setIsPreview] = useState(true);

  const easing = useMemo(() => createBezierEasing(...curve), [curve]);
  const activePreset = useMemo(() => findMatchingPreset(curve), [curve]);

  // Callbacks below are stable (no per-render identity), so the memoized panels
  // they're passed to don't re-render on every animation frame. State they need
  // is read through refs.
  const playStateRef = useRef({ isPlaying, isPreview });
  playStateRef.current = { isPlaying, isPreview };

  const pause = useCallback(() => {
    setIsPreview(false);
    setIsPlaying(false);
  }, []);

  const { direction, linearProgress } = useLoopingTimeline({
    durationMs,
    isPlaying,
    restartToken,
    cycleLimit: isPreview ? 1 : null,
    onComplete: pause,
  });

  const easedProgress = easing(linearProgress);
  const value = direction === "in" ? easedProgress : 1 - easedProgress;

  const replay = useCallback(() => {
    setIsPreview(false);
    setRestartToken((token) => token + 1);
    setIsPlaying(true);
  }, []);

  const togglePlaying = useCallback(() => {
    setIsPreview(false);
    setIsPlaying((playing) => !playing);
  }, []);

  // Shared by every demo: mirror the loop while it plays, take over when triggered.
  const motion = {
    loopValue: value,
    isPlaying,
    restartToken,
    easing,
    durationMs,
    onInteract: pause,
  };

  // Once an edit settles, play the new curve once from the top. The continuous
  // loop already shows edits live, so it's left alone.
  const previewCurve = useCallback(() => {
    const { isPlaying: playing, isPreview: previewing } = playStateRef.current;
    if (prefersReducedMotion || (playing && !previewing)) return;
    setIsPreview(true);
    setRestartToken((token) => token + 1);
    setIsPlaying(true);
  }, []);

  // Typed values preview after a short pause in typing, not on every keystroke.
  const inputPreviewTimeout = useRef();
  useEffect(() => () => clearTimeout(inputPreviewTimeout.current), []);

  const changeCurveFromInput = useCallback(
    (nextCurve) => {
      setCurve(nextCurve);
      clearTimeout(inputPreviewTimeout.current);
      inputPreviewTimeout.current = setTimeout(previewCurve, 450);
    },
    [previewCurve],
  );

  // A preset restarts from the top: one cycle if paused or previewing, or the
  // continuous loop if that's what was running.
  const selectPreset = useCallback((preset) => {
    setCurve(preset.curve);
    const { isPlaying: playing } = playStateRef.current;
    if (prefersReducedMotion && !playing) return;
    if (!playing) setIsPreview(true);
    setRestartToken((token) => token + 1);
    setIsPlaying(true);
  }, []);

  return (
    <>
      <Backdrop />
      {/* From lg up the whole app fits one screen (e.g. a 14" laptop); below a
          sensible minimum height it scrolls rather than crushing the demos. */}
      <main className="mx-auto max-w-[1280px] px-4 pt-14 pb-40 sm:px-8 max-[560px]:pt-10 lg:flex lg:h-dvh lg:min-h-[780px] lg:max-w-[1120px] lg:flex-col lg:pt-8 lg:pb-12">
        <header className="flex flex-wrap items-end justify-between gap-6 lg:shrink-0">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-3">
              <CatchOrb className="size-10 shrink-0 drop-shadow-[2px_2px_0_var(--ink)] lg:size-7" />
              <h1 className="m-0 font-pixel text-[clamp(20px,3.4vw,32px)] leading-[1.3] text-ink [text-shadow:3px_3px_0_var(--electric)] lg:text-[22px]">
                Transition Playground
              </h1>
            </div>
            <p className="m-0 mt-4 text-[16px] leading-[1.65] text-ink-soft lg:mt-1 lg:text-[13.5px]">
              Drag the handles to shape a curve.
            </p>
          </div>

          {/* The party hops with the current curve. */}
          <div
            aria-hidden="true"
            className="flex items-end gap-1 max-sm:hidden"
          >
            {PARTY.map((kind) => (
              <div key={kind} className="flex flex-col items-center">
                <div style={{ transform: `translateY(${-value * 18}px)` }}>
                  <Creature kind={kind} className="size-12 lg:size-9" />
                </div>
                <div
                  className="mt-0.5 h-1.5 w-8 rounded-full bg-ink/20"
                  style={{
                    transform: `scaleX(${1 - Math.min(1, Math.max(0, value)) * 0.4})`,
                  }}
                />
              </div>
            ))}
          </div>
        </header>

        {/* Columns stretch to the same height; the demo cards absorb any difference. */}
        <div className="mt-10 grid gap-5 lg:mt-4 lg:min-h-0 lg:flex-1 lg:gap-4 lg:grid-cols-[minmax(280px,340px)_1fr] lg:grid-rows-[minmax(0,1fr)]">
          <section
            aria-label="Curve"
            className="panel flex flex-col rounded-3xl p-5 lg:min-h-0 lg:rounded-2xl lg:p-3.5"
          >
            {/* The chart takes whatever height is left and scales to fit it. */}
            <div className="lg:min-h-0 lg:flex-1">
            <CurveEditor
              curve={curve}
              onChange={setCurve}
              onChangeEnd={previewCurve}
              playhead={
                isPlaying
                  ? { time: linearProgress, progress: easedProgress }
                  : null
              }
            />
            </div>
            <div className="mt-4 lg:mt-2.5">
              <CurveInputs curve={curve} onChange={changeCurveFromInput} />
            </div>
            <div className="mt-4 lg:mt-2.5">
              <CodeExport curve={curve} durationMs={durationMs} />
            </div>
          </section>

          <section aria-label="Preview" className="flex min-w-0 flex-col gap-5 lg:min-h-0 lg:gap-3.5">
            <div className="panel rounded-3xl p-5 lg:shrink-0 lg:rounded-2xl lg:p-3.5">
              <PresetPicker
                activePreset={activePreset}
                onSelect={selectPreset}
              />
              <div className="mt-4 border-t border-border-strong pt-4 lg:mt-3 lg:pt-3">
                <PlaybackControls
                  isPlaying={isPlaying}
                  onTogglePlaying={togglePlaying}
                  onReplay={replay}
                  durationMs={durationMs}
                  onDurationChange={setDurationMs}
                />
              </div>
            </div>

            <div className="grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2 lg:min-h-0 lg:gap-3.5">
              <ToggleDemo motion={motion} />
              <ToastDemo motion={motion} />
              <ModalDemo motion={motion} />
              <ReorderDemo motion={motion} />
            </div>

          </section>
        </div>
      </main>
    </>
  );
}
