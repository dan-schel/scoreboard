import { Game, GameState, PlayerCount } from "../game";
import {
  GameConfigShape,
  GameConfig,
  IntegerGameConfigProp,
} from "../game-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configShape = new TennisConfigShape();
  readonly playerCount = PlayerCount.exactly(2);

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

export class TennisConfigShape extends GameConfigShape<TennisConfig> {
  static readonly setsToWin = new IntegerGameConfigProp("sets-to-win", {
    min: 1,
  });

  readonly props = [TennisConfigShape.setsToWin];
  readonly defaultConfig = TennisConfig.default;

  parse(values: Map<string, unknown>): TennisConfig {
    const setsToWin = GameConfigShape.getValue(
      TennisConfigShape.setsToWin,
      values,
    );

    return new TennisConfig(setsToWin);
  }

  toMap(config: TennisConfig): Map<string, unknown> {
    return new Map([[TennisConfigShape.setsToWin.key, config.setsToWin]]);
  }
}

export class TennisConfig extends GameConfig {
  static readonly default = new TennisConfig(2);

  constructor(readonly setsToWin: number) {
    super();
  }
}
