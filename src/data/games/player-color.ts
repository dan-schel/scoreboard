export const PlayerColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
] as const;

export type PlayerColor = (typeof PlayerColors)[number];
