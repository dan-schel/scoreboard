import { PlayerColorConfigProp } from "./config-prop";
import { ConfigShape } from "./game-config";

export class PlayerConfig {
  static readonly twoPlayers = [
    new PlayerConfig("red"),
    new PlayerConfig("blue"),
  ];

  constructor(readonly color: PlayerColor) {}
}

export class PlayerConfigShape extends ConfigShape<PlayerConfig> {
  static readonly color = new PlayerColorConfigProp("color");

  readonly props = [PlayerConfigShape.color];

  parse(values: Map<string, unknown>): PlayerConfig {
    const color = ConfigShape.getValue(PlayerConfigShape.color, values);
    return new PlayerConfig(color);
  }

  toMap(config: PlayerConfig): Map<string, unknown> {
    return new Map([[PlayerConfigShape.color.key, config.color]]);
  }
}

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
