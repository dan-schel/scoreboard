import { Game, GameState, PlayerCount } from "../game";
import {
  GameConfig,
  GameConfigShape,
  IntegerGameConfigProp,
} from "../game-config";

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

export class BasicGameConfigShape extends GameConfigShape<BasicGameConfig> {
  static readonly winningScore = new IntegerGameConfigProp("winning-score", {
    min: 1,
  });

  static readonly requiredMargin = new IntegerGameConfigProp(
    "required-margin",
    {
      min: 1,
    },
  );

  readonly props = [
    BasicGameConfigShape.winningScore,
    BasicGameConfigShape.requiredMargin,
  ];

  parse(values: Map<string, unknown>): BasicGameConfig {
    const winningScore = GameConfigShape.getValue(
      BasicGameConfigShape.winningScore,
      values,
    );
    const requiredMargin = GameConfigShape.getValue(
      BasicGameConfigShape.requiredMargin,
      values,
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
