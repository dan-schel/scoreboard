import { IntegerConfigProp } from "../config-prop";
import { Game, GameState, PlayerCount } from "../game";
import {
  GameConfig,
  GameConfigShape,
  type RawGameConfig,
} from "../game-config";
import { PlayerConfig, PlayerConfigShape } from "../player-config";

export class BasicGame extends Game<
  PlayerConfig,
  BasicGameConfig,
  BasicGameState
> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly configShape = new BasicGameConfigShape();

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

export class BasicGameConfigShape extends GameConfigShape<
  PlayerConfig,
  BasicGameConfig
> {
  static readonly winningScore = new IntegerConfigProp("winning-score", {
    min: 1,
  });
  static readonly requiredMargin = new IntegerConfigProp("required-margin", {
    min: 1,
  });

  readonly playerCount = PlayerCount.exactly(2);
  readonly playerConfigShape = new PlayerConfigShape();
  readonly props = [
    BasicGameConfigShape.winningScore,
    BasicGameConfigShape.requiredMargin,
  ];
  readonly defaultConfig = BasicGameConfig.default;

  parseGameConfig(
    values: Map<string, unknown>,
    players: PlayerConfig[],
  ): BasicGameConfig {
    const winningScore = GameConfigShape.getValue(
      BasicGameConfigShape.winningScore,
      values,
    );
    const requiredMargin = GameConfigShape.getValue(
      BasicGameConfigShape.requiredMargin,
      values,
    );
    return new BasicGameConfig(players, winningScore, requiredMargin);
  }

  gameConfigToMap(config: BasicGameConfig): RawGameConfig<PlayerConfig> {
    return {
      values: new Map([
        [BasicGameConfigShape.winningScore.key, config.winningScore],
        [BasicGameConfigShape.requiredMargin.key, config.requiredMargin],
      ]),
      players: config.players,
    };
  }
}

export class BasicGameConfig extends GameConfig<PlayerConfig> {
  static readonly default = new BasicGameConfig(PlayerConfig.twoPlayers, 10, 2);

  constructor(
    players: PlayerConfig[],
    readonly winningScore: number,
    readonly requiredMargin: number,
  ) {
    super(players);
  }
}
