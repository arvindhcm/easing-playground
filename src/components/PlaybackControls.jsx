import { memo } from "react";
function PlaybackControls({ isPlaying, onTogglePlaying, onReplay, durationMs, onDurationChange }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onTogglePlaying}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-9 cursor-pointer lg:size-8 place-items-center rounded-full border-2 border-ink bg-accent text-white shadow-[2px_2px_0_var(--ink)] transition-transform active:scale-95"
        >
          {isPlaying ? (
            <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5 fill-current" aria-hidden="true">
              <path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5Z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onReplay}
          aria-label="Replay from the start"
          className="grid size-9 cursor-pointer lg:size-8 place-items-center rounded-full border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--ink)] transition-transform active:scale-95"
        >
          <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9" strokeLinecap="round" />
            <path d="M2.5 2.5v3h3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <label className="flex min-w-[240px] flex-1 items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">Duration</span>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={durationMs}
          onChange={(event) => onDurationChange(Number(event.target.value))}
          className="flex-1 cursor-pointer accent-accent"
        />
        <span className="w-[60px] text-right font-mono text-[13px] text-ink lg:text-[12px]">{durationMs}ms</span>
      </label>
    </div>
  );
}

// Memoized: its props stay the same while the loop animates.
export default memo(PlaybackControls);
