import { Game, GameState } from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configWriter = new TennisConfigWriter();

  initialState(_config: TennisConfig): TennisState {
    return new TennisState(TennisScore.zero, TennisScore.zero);
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
