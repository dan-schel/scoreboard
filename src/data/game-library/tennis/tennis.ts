import { BasicPlayerConfig } from "../../game-utils/basic-player-config";
import { Game, GameState } from "../../game/game";
import { TennisConfig, TennisConfigAdapter } from "./tennis-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<BasicPlayerConfig, TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configAdapter = new TennisConfigAdapter();

  initialState(config: TennisConfig): TennisState {
    return new TennisState(config, TennisScore.zero, TennisScore.zero);
  }
}

export class TennisState extends GameState<TennisConfig> {
  constructor(
    config: TennisConfig,
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super(config);
  }
}
