import {
  GameBuilder,
  GameInstance,
  GameState,
  ScoreType,
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
}

export class TennisState extends GameState {
  constructor(
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super();
  }
}

export class TennisGameInstance extends GameInstance<
  TennisConfig,
  TennisState
> {
  getInitialState(): TennisState {
    return new TennisState(TennisScore.zero, TennisScore.zero);
  }

  getScoreTypes(): ScoreType[] {}
  canIncrementScore(
    state: TennisState,
    scoreID: string,
    playerIndex: number,
  ): boolean {}
  incrementScore(
    state: TennisState,
    scoreID: string,
    playerIndex: number,
  ): TennisState {}
}
