/**
 * Stat labels used throughout the application
 */
export const STAT_LABELS_SHORT = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"] as const;

export const STAT_LABELS_FULL = [
  "Health",
  "Attack",
  "Defense",
  "Special Attack",
  "Special Defense",
  "Speed",
] as const;

/**
 * Stat colors used for charts and displays
 */
export const STAT_COLORS = [
  "#FF5959", // HP
  "#F5AC78", // Atk
  "#FAE078", // Def
  "#9DB7F5", // SpA
  "#A7DB8D", // SpD
  "#FA92B2", // Spe
] as const;
