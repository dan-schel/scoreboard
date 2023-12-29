import { PlayerColorConfigProp } from "../game/config-prop";
import type { PlayerColor } from "./player-color";
import { PlayerConfig, PlayerConfigAdapter } from "../game/player-config";

export class BasicPlayerConfig extends PlayerConfig {
  static readonly twoPlayers = [
    new BasicPlayerConfig("red"),
    new BasicPlayerConfig("blue"),
  ];

  constructor(readonly color: PlayerColor) {
    super();
  }

  with({ color }: { color?: PlayerColor }) {
    return new BasicPlayerConfig(color ?? this.color);
  }
}

export class BasicPlayerConfigAdapter extends PlayerConfigAdapter<BasicPlayerConfig> {
  static readonly color = new PlayerColorConfigProp("color");
  readonly props = [BasicPlayerConfigAdapter.color];

  get(config: BasicPlayerConfig, prop: string): unknown {
    switch (prop) {
      case BasicPlayerConfigAdapter.color.key:
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
      case BasicPlayerConfigAdapter.color.key:
        return config.with({
          color: BasicPlayerConfigAdapter.color.parse(value),
        });
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }
}
