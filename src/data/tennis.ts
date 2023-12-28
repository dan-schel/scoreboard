import {
  Game,
  GameConfig,
  GameConfigDefinition,
  GameState,
  PlayerCount,
} from "./game";

export class Tennis extends Game<TennisConfig, TennisState> {
  readonly defaultConfig = TennisConfig.default;
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

export class TennisConfigDefinition extends GameConfigDefinition<TennisConfig> {
  static readonly setsToWin = "sets-to-win";

  parse(values: Map<string, unknown>): TennisConfig {
    const setsToWin = GameConfigDefinition.requireNumber(
      values,
      TennisConfigDefinition.setsToWin,
      {
        integer: true,
        min: 1,
      },
    );

    return new TennisConfig(setsToWin);
  }
}

export class TennisConfig extends GameConfig {
  static readonly default = new TennisConfig(2);

  constructor(readonly setsToWin: number) {
    super();
  }
}

export type TennisPoints = "0" | "15" | "30" | "40" | "advantage";

export class TennisScore {
  static readonly zero = new TennisScore("0", 0, []);

  constructor(
    readonly points: TennisPoints,
    readonly games: number,
    readonly setHistory: TennisSetHistory[],
  ) {}
}

export class TennisSetHistory {
  constructor(
    readonly winner: boolean,
    readonly gamesWon: number,
  ) {}
}
