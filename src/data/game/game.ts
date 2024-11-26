import type { AccentColor } from "../game-utils/accent-color";
import type { GameConfig, GameConfigWriter } from "./config/config";

export abstract class GameBuilder<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly color: AccentColor;
  abstract readonly configWriter: GameConfigWriter<GameConfigType>;

  constructor() {}

  abstract build(
    config: GameConfigType,
    uuid: string,
  ): GameInstance<GameConfigType, GameStateType>;

  abstract serializeConfig(config: GameConfigType): unknown;
  abstract deserializeConfig(input: unknown): GameConfigType;
}

export abstract class GameInstance<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  constructor(
    readonly game: GameBuilder<GameConfigType, GameStateType>,
    readonly config: GameConfigType,
    readonly uuid: string,
  ) {}

  abstract getInitialState(): GameStateType;

  abstract serializeState(state: GameStateType): unknown;
  abstract deserializeState(input: unknown): GameStateType;

  getPlayerCount() {
    return this.config.getPlayerCount();
  }

  abstract getScoreType(): ScoreType;
}

export abstract class GameState<GameStateType extends GameState = any> {
  abstract do(action: Action): GameStateType;
  abstract toDisplayString(): string;
  abstract getScoreHeadline(): string | null;
  abstract isGameOver(): boolean | { winner: AccentColor };
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

  abstract getPlayerColor(playerIndex: number): AccentColor;

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
