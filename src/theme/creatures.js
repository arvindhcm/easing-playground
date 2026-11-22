// Original creature mascots for the monster-trainer theme.
// Each one is drawn as inline SVG in Creature.jsx. To use your own artwork instead,
// set `imageSrc` to a file in /public (e.g. "./creatures/sparkit.png").
export const CREATURES = {
  sparkit: { name: "Sparkit", type: "electric", imageSrc: null },
  embercub: { name: "Embercub", type: "fire", imageSrc: null },
  drizzlet: { name: "Drizzlet", type: "water", imageSrc: null },
  sproutle: { name: "Sproutle", type: "grass", imageSrc: null },
};

export const TYPE_COLORS = {
  electric: "#f7c600",
  fire: "#f25c3b",
  water: "#3b8ef0",
  grass: "#4cb85a",
  psychic: "#ec5f9a",
  ghost: "#7357a6",
  normal: "#a8a77a",
  steel: "#8a96a8",
};
