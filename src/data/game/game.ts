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
}

export abstract class GameState {}

export abstract class GameInstance<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  constructor(readonly config: GameConfigType) {}

  abstract getInitialState(): GameStateType;

  abstract getScoreTypes(): ScoreType[];

  abstract canIncrementScore(
    state: GameStateType,
    scoreID: string,
    playerIndex: number,
  ): boolean;

  abstract incrementScore(
    state: GameStateType,
    scoreID: string,
    playerIndex: number,
  ): GameStateType;

  // For basketball:
  // abstract addScore(state, scoreID, playerIndex, )
}

export type ScoreEntryMethod =
  | { type: "none" }
  | { type: "increment" }
  | { type: "discrete"; actions: { id: string; text: string }[] }
  | { type: "add" }
  | { type: "replace" };

export class ScoreType {
  constructor(readonly id: string) {}
}
