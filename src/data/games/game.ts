import type { GameConfig } from "./game-config";

export abstract class Game<
  GameConfigType extends GameConfig,
  GameStateType extends GameState<any>,
> {
  abstract readonly defaultConfig: GameConfigType;
  abstract readonly playerCount: PlayerCount;

  constructor() {}

  abstract initialState(config: GameConfigType): GameStateType;
}

export abstract class GameState<GameStateType extends GameState<any>> {
  constructor(readonly game: Game<GameConfig, GameStateType>) {}
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
