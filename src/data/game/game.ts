import type { GameConfig, GameConfigWriter } from "./game-config";

export abstract class Game<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  abstract readonly id: string;
  abstract readonly name: string;

  abstract readonly configWriter: GameConfigWriter<GameConfigType>;

  constructor() {}

  abstract getInitialState(config: GameConfigType): GameStateType;

  abstract getScoreSystem(config: GameConfigType): ScoreSystem;
}

export abstract class GameState {}

export abstract class ScoreSystem {}
