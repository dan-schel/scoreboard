import type { GameConfig, GameConfigShape } from "./game-config";

export abstract class Game<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState<any> = GameState<any>,
> {
  abstract readonly configShape: GameConfigShape<GameConfigType>;
  abstract readonly playerCount: PlayerCount;
  abstract readonly id: string;
  abstract readonly name: string;

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
