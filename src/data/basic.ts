import {
  Game,
  GameConfig,
  GameConfigDefinition,
  GameState,
  PlayerCount,
} from "./game";

export class BasicGame extends Game<BasicGameConfig, BasicGameState> {
  readonly defaultConfig = BasicGameConfig.default;
  readonly playerCount = PlayerCount.exactly(2);

  initialState(_config: BasicGameConfig): BasicGameState {
    return new BasicGameState(this, 0, 0);
  }
}

export class BasicGameState extends GameState<BasicGameState> {
  constructor(
    readonly game: BasicGame,
    readonly player1Score: number,
    readonly player2Score: number,
  ) {
    super(game);
  }
}

export class BasicGameConfigDefinition extends GameConfigDefinition<BasicGameConfig> {
  static readonly winningScore = "winning-score";
  static readonly requiredMargin = "required-margin";

  parse(values: Map<string, unknown>): BasicGameConfig {
    const winningScore = GameConfigDefinition.requireNumber(
      values,
      BasicGameConfigDefinition.winningScore,
      {
        integer: true,
        min: 1,
      },
    );
    const requiredMargin = GameConfigDefinition.requireNumber(
      values,
      BasicGameConfigDefinition.requiredMargin,
      {
        integer: true,
        min: 1,
      },
    );

    return new BasicGameConfig(winningScore, requiredMargin);
  }
}

export class BasicGameConfig extends GameConfig {
  static readonly default = new BasicGameConfig(10, 2);

  constructor(
    readonly winningScore: number,
    readonly requiredMargin: number,
  ) {
    super();
  }
}
