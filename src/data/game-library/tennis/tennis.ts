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

  build(
    config: TennisConfig,
    uuid: string,
  ): GameInstance<TennisConfig, TennisState> {
    return new TennisGameInstance(this, config, uuid);
  }
  serializeConfig(config: TennisConfig): unknown {
    throw new Error("Method not implemented.");
  }
  deserializeConfig(input: unknown): TennisConfig {
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
  serializeState(state: TennisState): unknown {
    throw new Error("Method not implemented.");
  }
  deserializeState(input: unknown): TennisState {
    throw new Error("Method not implemented.");
  }
  getScoreTypes(): ScoreType[] {
    throw new Error("Method not implemented.");
  }
}

export class TennisState extends GameState<TennisConfig, TennisState> {
  constructor(
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super();
  }
  do(action: Action, config: TennisConfig): TennisState {
    throw new Error("Method not implemented.");
  }
  toDisplayString(config: TennisConfig): string {
    throw new Error("Method not implemented.");
  }
}
