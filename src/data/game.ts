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

export abstract class GameConfig {}

export abstract class GameConfigDefinition<GameConfigType extends GameConfig> {
  abstract parse(values: Map<string, unknown>): GameConfigType;

  static requireNumber(
    values: Map<string, unknown>,
    key: string,
    {
      integer = false,
      min,
      max,
    }: { integer?: boolean; min?: number; max?: number } = {},
  ): number {
    const value = values.get(key);
    if (typeof value !== "number") {
      throw new Error(`Expected number for "${key}".`);
    }
    if (integer && !Number.isInteger(value)) {
      throw new Error(`Expected integer for "${key}".`);
    }
    if (min !== undefined && value < min) {
      throw new Error(`Expected ${key} to be at least ${min}.`);
    }
    if (max !== undefined && value > max) {
      throw new Error(`Expected ${key} to be at most ${max}.`);
    }
    return value;
  }
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
