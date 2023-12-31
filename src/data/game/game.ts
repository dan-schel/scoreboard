import type { GameConfig, GameConfigWriter } from "./game-config";

export abstract class GameBuilder<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly configWriter: GameConfigWriter<GameConfigType>;

  constructor() {}

  abstract build(
    config: GameConfigType,
  ): GameInstance<GameConfigType, GameStateType>;

  abstract serializeConfig(config: GameConfigType): string;
  abstract deserializeConfig(input: string): GameConfigType;
}

export abstract class GameInstance<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  constructor(readonly config: GameConfigType) {}

  abstract getInitialState(): GameStateType;

  abstract serializeState(state: GameStateType): string;
  abstract deserializeState(input: string): GameStateType;

  getPlayerCount() {
    return this.config.players.length;
  }
  abstract getScoreTypes(): ScoreType[];
}

export abstract class GameState<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = any,
> {
  abstract do(action: Action, config: GameConfigType): GameStateType;
}

export abstract class ScoreType {
  constructor(readonly id: string) {}
}

export type Action<T = unknown> = {
  id: string;
  data: T;
};

export abstract class SimpleScoreType<
  GameStateType extends GameState,
> extends ScoreType {
  constructor(id: string) {
    super(id);
  }

  abstract getScoreString(state: GameStateType, playerIndex: number): string;

  abstract canIncrementScore(
    state: GameStateType,
    playerIndex: number,
  ): boolean;

  abstract getIncrementAction(
    state: GameStateType,
    playerIndex: number,
  ): Action;
}
