export const PlayerColors = ["orange", "green", "blue", "purple"] as const;

export type PlayerColor = (typeof PlayerColors)[number];

export function getPlayerColorDisplayString(color: PlayerColor) {
  return {
    orange: "Orange",
    green: "Green",
    blue: "Blue",
    purple: "Purple",
  }[color];
}
