// Same approach browsers use for CSS cubic-bezier(): solve the x(t) polynomial
// for t (Newton's method, bisection fallback), then evaluate y(t).
export function createBezierEasing(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleSlopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x) => {
    let t = x;
    for (let iteration = 0; iteration < 8; iteration++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return t;
      const slope = sampleSlopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }

    let low = 0;
    let high = 1;
    t = x;
    for (let iteration = 0; iteration < 40; iteration++) {
      const sampled = sampleX(t);
      if (Math.abs(sampled - x) < 1e-6) break;
      if (x > sampled) low = t;
      else high = t;
      t = (low + high) / 2;
    }
    return t;
  };

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sampleY(solveT(x));
  };
}

export function formatCurveNumber(value) {
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}
