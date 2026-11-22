import { useEffect, useRef, useState } from "react";

const HOLD_AFTER_IN_MS = 700;
const HOLD_AFTER_OUT_MS = 450;
const RESTING_FRAME = { direction: "in", linearProgress: 1 };

function frameAt(elapsedMs, durationMs) {
  const inEnd = durationMs;
  const holdInEnd = inEnd + HOLD_AFTER_IN_MS;
  const outEnd = holdInEnd + durationMs;

  if (elapsedMs < inEnd) return { direction: "in", linearProgress: elapsedMs / durationMs };
  if (elapsedMs < holdInEnd) return { direction: "in", linearProgress: 1 };
  if (elapsedMs < outEnd) {
    return { direction: "out", linearProgress: (elapsedMs - holdInEnd) / durationMs };
  }
  return { direction: "out", linearProgress: 1 };
}

// Loops in → hold → out → hold. The curve isn't a dependency on purpose, so
// dragging a handle mid-loop updates the motion live instead of restarting it.
// With `cycleLimit`, it stops after that many cycles and calls `onComplete`.
export function useLoopingTimeline({ durationMs, isPlaying, restartToken, cycleLimit = null, onComplete }) {
  const [frame, setFrame] = useState(RESTING_FRAME);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isPlaying) return undefined;

    const cycleMs = durationMs * 2 + HOLD_AFTER_IN_MS + HOLD_AFTER_OUT_MS;
    const startedAt = performance.now();
    let animationFrameId;

    const tick = (now) => {
      const elapsedMs = now - startedAt;
      if (cycleLimit !== null && elapsedMs >= cycleLimit * cycleMs) {
        setFrame({ direction: "out", linearProgress: 1 });
        onCompleteRef.current?.();
        return;
      }
      const next = frameAt(elapsedMs % cycleMs, durationMs);
      // Holds produce the same frame over and over; returning `prev` skips the re-render.
      setFrame((prev) =>
        prev.direction === next.direction && prev.linearProgress === next.linearProgress ? prev : next,
      );
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [durationMs, isPlaying, restartToken, cycleLimit]);

  return frame;
}
