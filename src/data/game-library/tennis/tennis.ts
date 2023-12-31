import type { GameConfig } from "@/data/game/game-config";
import type { PlayerConfig } from "@/data/game/player-config";
import {
  GameBuilder,
  GameInstance,
  GameState,
  ScoreType,
  type Action,
} from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";

export class TennisBuilder extends GameBuilder<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configWriter = new TennisConfigWriter();

  build(config: TennisConfig): GameInstance<TennisConfig, TennisState> {
    return new TennisGameInstance(config);
  }
  serializeConfig(config: TennisConfig): string {
    throw new Error("Method not implemented.");
  }
  deserializeConfig(input: string): TennisConfig {
    throw new Error("Method not implemented.");
  }
}

export class TennisGameInstance extends GameInstance<
  TennisConfig,
  TennisState
> {
  getInitialState(): TennisState {
    return new TennisState(TennisScore.zero, TennisScore.zero);
  }
  serializeState(state: TennisState): string {
    throw new Error("Method not implemented.");
  }
  deserializeState(input: string): TennisState {
    throw new Error("Method not implemented.");
  }
  getScoreTypes(): ScoreType[] {
    throw new Error("Method not implemented.");
  }
}

export class TennisState extends GameState {
  constructor(
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super();
  }
  do(action: Action, config: GameConfig<PlayerConfig>) {
    throw new Error("Method not implemented.");
  }
}
