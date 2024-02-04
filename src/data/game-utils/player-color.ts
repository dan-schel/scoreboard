export const PlayerColors = ["orange", "green", "blue", "purple"] as const;

export type PlayerColor = (typeof PlayerColors)[number];
