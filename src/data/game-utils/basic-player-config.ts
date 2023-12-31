import { PlayerColorConfigProp } from "../game/config-prop";
import { PlayerColors, type PlayerColor } from "./player-color";
import { PlayerConfig, PlayerConfigWriter } from "../game/player-config";
import { z } from "zod";

export class BasicPlayerConfig extends PlayerConfig {
  static readonly twoPlayers = [
    new BasicPlayerConfig("red"),
    new BasicPlayerConfig("blue"),
  ];

  constructor(readonly color: PlayerColor) {
    super();
  }

  static readonly json = z
    .object({
      color: z.enum(PlayerColors),
    })
    .transform((x) => new BasicPlayerConfig(x.color));

  toJSON(): z.input<typeof BasicPlayerConfig.json> {
    return {
      color: this.color,
    };
  }

  with({ color }: { color?: PlayerColor }) {
    return new BasicPlayerConfig(color ?? this.color);
  }
}

export class BasicPlayerConfigWriter extends PlayerConfigWriter<BasicPlayerConfig> {
  static readonly color = new PlayerColorConfigProp("color");
  readonly props = [BasicPlayerConfigWriter.color];

  get(config: BasicPlayerConfig, prop: string): unknown {
    switch (prop) {
      case BasicPlayerConfigWriter.color.key:
        return config.color;
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }

  set(
    config: BasicPlayerConfig,
    prop: string,
    value: unknown,
  ): BasicPlayerConfig {
    switch (prop) {
      case BasicPlayerConfigWriter.color.key:
        return config.with({
          color: BasicPlayerConfigWriter.color.parse(value),
        });
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }
}
