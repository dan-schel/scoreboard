import type { ConfigProp } from "./config-prop";
import type { PlayerCount } from "./game";
import { type PlayerConfig } from "./player-config";

export abstract class GameConfig<PlayerConfigType extends PlayerConfig> {
  constructor(readonly players: PlayerConfigType[]) {}
}

export abstract class ConfigShape<ConfigType> {
  abstract readonly props: ConfigProp<string, unknown>[];

  abstract parse(values: Map<string, unknown>): ConfigType;

  abstract toMap(config: ConfigType): Map<string, unknown>;

  with(
    config: ConfigType,
    prop: ConfigProp<string, unknown>,
    value: unknown,
  ): ConfigType {
    const values = this.toMap(config);
    values.set(prop.key, value);
    return this.parse(values);
  }

  static getValue<T>(
    prop: ConfigProp<string, T>,
    values: Map<string, unknown>,
  ): T {
    const value = values.get(prop.key);
    if (value === undefined) {
      throw new Error(`Expected "${prop.key}" prop.`);
    }
    return prop.parse(value);
  }
}

export type RawGameConfig<PlayerConfigType> = {
  values: Map<string, unknown>;
  players: PlayerConfigType[];
};

export abstract class GameConfigShape<
  PlayerConfigType extends PlayerConfig,
  GameConfigType extends GameConfig<PlayerConfigType>,
> extends ConfigShape<GameConfigType> {
  abstract readonly defaultConfig: GameConfigType;
  abstract readonly playerCount: PlayerCount;
  abstract readonly playerConfigShape: ConfigShape<PlayerConfigType>;

  parse(values: Map<string, unknown>): GameConfigType {
    const players = this.playerConfigShape.parse(values);
    return this.parseGameConfig(values, players);
  }

  abstract parseGameConfig(
    values: Map<string, unknown>,
    players: PlayerConfigType[],
  ): GameConfigType;

  toMap(config: GameConfigType): Map<string, unknown> {}

  abstract gameConfigToMap(
    config: GameConfigType,
  ): RawGameConfig<PlayerConfigType>;
}
