import { BasicPlayerConfig } from "../../game-utils/basic-player-config";
import { Game, GameState } from "../../game/game";
import { TennisConfig, TennisConfigAdapter } from "./tennis-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<BasicPlayerConfig, TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configAdapter = new TennisConfigAdapter();

  initialState(_config: TennisConfig): TennisState {
    return new TennisState(this, TennisScore.zero, TennisScore.zero);
  }
}

export class TennisState extends GameState<TennisState> {
  constructor(
    readonly game: Tennis,
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super(game);
  }
}
