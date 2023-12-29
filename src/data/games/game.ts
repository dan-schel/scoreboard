import type { GameConfig, GameConfigShape } from "./game-config";
import type { PlayerConfig } from "./player-config";

export abstract class Game<
  PlayerConfigType extends PlayerConfig = PlayerConfig,
  GameConfigType extends
    GameConfig<PlayerConfigType> = GameConfig<PlayerConfigType>,
  GameStateType extends GameState<any> = GameState<any>,
> {
  abstract readonly configShape: GameConfigShape<
    PlayerConfigType,
    GameConfigType
  >;
  abstract readonly id: string;
  abstract readonly name: string;

  constructor() {}

  abstract initialState(config: GameConfigType): GameStateType;
}

export abstract class GameState<GameStateType extends GameState<any>> {
  constructor(
    readonly game: Game<PlayerConfig, GameConfig<PlayerConfig>, GameStateType>,
  ) {}
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
