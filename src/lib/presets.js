export const PRESETS = [
  {
    name: "Snappy",
    type: "electric",
    curve: [0.22, 1, 0.36, 1],
    guidance:
      "Fast start, soft landing. The best default for anything entering the screen — menus, toasts, popovers.",
  },
  {
    name: "Gentle",
    type: "water",
    curve: [0.65, 0, 0.35, 1],
    guidance:
      "Eases in and out. Use it for elements travelling from one spot to another while staying on screen.",
  },
  {
    name: "Exit",
    type: "ghost",
    curve: [0.55, 0, 1, 0.45],
    guidance:
      "Slow start, fast finish. Right for things leaving the screen — feels sluggish on entrances.",
  },
  {
    name: "Overshoot",
    type: "fire",
    curve: [0.34, 1.56, 0.64, 1],
    guidance:
      "Shoots past the target, then settles. Adds personality to small things like badges, likes and toggles. Use sparingly.",
  },
  {
    name: "Anticipate",
    type: "psychic",
    curve: [0.68, -0.55, 0.27, 1.55],
    guidance:
      "Pulls back before it moves, overshoots on arrival. Big character — great for a one-off moment, tiring in everyday UI.",
  },
  {
    name: "Browser ease",
    type: "normal",
    curve: [0.25, 0.1, 0.25, 1],
    guidance:
      "What the CSS keyword “ease” gives you. Decent, but a little soft at the end for most interface motion.",
  },
  {
    name: "Linear",
    type: "steel",
    curve: [0, 0, 1, 1],
    guidance:
      "Constant speed. Feels mechanical on UI elements — keep it for spinners, progress bars and colour fades.",
  },
];

export function findMatchingPreset(curve) {
  return PRESETS.find((preset) =>
    preset.curve.every((value, index) => Math.abs(value - curve[index]) < 0.005)
  );
}
