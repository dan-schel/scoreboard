export const PlayerColors = ["orange", "green", "blue", "purple"] as const;

export type PlayerColor = (typeof PlayerColors)[number];

export const playerColorDisplayStrings: Record<PlayerColor, string> = {
  orange: "Orange",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
};

export function getPlayerColorDisplayString(color: PlayerColor) {
  return playerColorDisplayStrings[color];
}
