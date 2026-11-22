import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motionPreference.js";

// Runs one eased 0→1 animation at a time with the current curve and duration,
// calling `onProgress(easedProgress)` every frame. Starting a new one cancels
// the old, so callers can interrupt mid-flight from wherever they are.
export function useEasedAnimator({ easing, durationMs }) {
  const frameRef = useRef();

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const cancel = () => cancelAnimationFrame(frameRef.current);

  const run = (onProgress) => {
    cancel();
    if (prefersReducedMotion || durationMs <= 0) {
      onProgress(1);
      return;
    }

    const startedAt = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      onProgress(t < 1 ? easing(t) : 1);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    onProgress(0);
    frameRef.current = requestAnimationFrame(tick);
  };

  return { run, cancel };
}

// Drops a demo's local state whenever the shared loop starts or restarts,
// handing the demo back to the loop.
export function useLoopHandoff({ isPlaying, restartToken }, reset) {
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    if (isPlaying) resetRef.current();
  }, [isPlaying, restartToken]);
}

// Drives one on/off demo. While the shared loop plays, the demo mirrors it.
// Once the user triggers the demo, it takes over locally: it animates from
// wherever it is now toward the opposite state.
export function useDemoMotion(motion) {
  const { loopValue, onInteract } = motion;
  const [local, setLocal] = useState(null); // { value, target } once the user takes over
  const animator = useEasedAnimator(motion);

  useLoopHandoff(motion, () => {
    animator.cancel();
    setLocal(null);
  });

  const value = local ? local.value : loopValue;
  const isOn = local ? local.target === 1 : loopValue >= 0.5;

  const toggle = () => {
    onInteract?.();
    const from = value;
    const target = isOn ? 0 : 1;
    animator.run((p) => setLocal({ value: from + (target - from) * p, target }));
  };

  return { value, isOn, toggle };
}
