import type { ConfigProp } from "./config-prop";
import { PlayerConfigWriter, type PlayerConfig } from "./player-config";

export abstract class GameConfig<
  PlayerConfigType extends PlayerConfig = PlayerConfig,
> {
  constructor(readonly players: PlayerConfigType[]) {}
}

export class PlayerCount {
  private constructor(
    readonly min: number,
    readonly max: number,
  ) {}

  static exactly(n: number) {
    return new PlayerCount(n, n);
  }

  static range(min: number, max: number) {
    return new PlayerCount(min, max);
  }
}

export type PlayerConfigTypeOf<GameConfigType extends GameConfig> =
  GameConfigType extends GameConfig<infer PlayerConfigType>
    ? PlayerConfigType
    : never;

export abstract class GameConfigWriter<GameConfigType extends GameConfig> {
  abstract readonly props: ConfigProp[];
  abstract readonly defaultConfig: GameConfigType;
  abstract readonly playerCount: PlayerCount;
  abstract readonly playerConfigWriter: PlayerConfigWriter<
    PlayerConfigTypeOf<GameConfigType>
  >;

  abstract get(config: GameConfigType, prop: string): unknown;

  abstract set(
    config: GameConfigType,
    prop: string,
    value: unknown,
  ): GameConfigType;

  protected abstract _setPlayer(
    config: GameConfigType,
    playerIndex: number,
    player: PlayerConfigTypeOf<GameConfigType>,
  ): GameConfigType;

  getForPlayer(
    config: GameConfigType,
    playerIndex: number,
    prop: string,
  ): unknown {
    const playerConfig = config.players[
      playerIndex
    ] as PlayerConfigTypeOf<GameConfigType>;
    return this.playerConfigWriter.get(playerConfig, prop);
  }

  setForPlayer(
    config: GameConfigType,
    playerIndex: number,
    prop: string,
    value: unknown,
  ): GameConfigType {
    const currentPlayerConfig = config.players[
      playerIndex
    ] as PlayerConfigTypeOf<GameConfigType>;
    const newPlayerConfig = this.playerConfigWriter.set(
      currentPlayerConfig,
      prop,
      value,
    );
    return this._setPlayer(config, playerIndex, newPlayerConfig);
  }
}
