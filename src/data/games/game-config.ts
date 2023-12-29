import type { ConfigProp } from "./config-prop";
import { PlayerConfigAdapter, type PlayerConfig } from "./player-config";

export abstract class GameConfig<PlayerConfigType extends PlayerConfig> {
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

export abstract class GameConfigAdapter<
  PlayerConfigType extends PlayerConfig,
  GameConfigType extends GameConfig<PlayerConfigType>,
> {
  abstract readonly props: ConfigProp[];
  abstract readonly defaultConfig: GameConfigType;
  abstract readonly playerCount: PlayerCount;
  abstract readonly playerConfigAdapter: PlayerConfigAdapter<PlayerConfigType>;

  abstract get(config: GameConfigType, prop: string): unknown;

  abstract set(
    config: GameConfigType,
    prop: string,
    value: unknown,
  ): GameConfigType;

  protected abstract _setPlayer(
    config: GameConfigType,
    playerIndex: number,
    player: PlayerConfigType,
  ): GameConfigType;

  getForPlayer(
    config: GameConfigType,
    playerIndex: number,
    prop: string,
  ): unknown {
    return this.playerConfigAdapter.get(config.players[playerIndex], prop);
  }

  setForPlayer(
    config: GameConfigType,
    playerIndex: number,
    prop: string,
    value: unknown,
  ): GameConfigType {
    const playerConfig = this.playerConfigAdapter.set(
      config.players[playerIndex],
      prop,
      value,
    );
    return this._setPlayer(config, playerIndex, playerConfig);
  }
}
