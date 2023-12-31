import { Game, GameState, ScoreSystem } from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configWriter = new TennisConfigWriter();

  getInitialState(_config: TennisConfig): TennisState {
    return new TennisState(TennisScore.zero, TennisScore.zero);
  }

  getScoreSystem(_config: TennisConfig): ScoreSystem {
    return new TennisScoreSystem();
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

export class TennisScoreSystem extends ScoreSystem {}
