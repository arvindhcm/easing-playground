// Read once at startup; shared so every animation respects the same setting.
export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
