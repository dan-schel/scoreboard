import {
  BasicPlayerConfig,
  BasicPlayerConfigAdapter,
} from "../../game-utils/basic-player-config";
import { IntegerConfigProp } from "../../game/config-prop";
import { Game, GameState } from "../../game/game";
import {
  GameConfig,
  GameConfigAdapter,
  PlayerCount,
} from "../../game/game-config";

export class BasicGame extends Game<
  BasicPlayerConfig,
  BasicGameConfig,
  BasicGameState
> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly configAdapter = new BasicGameConfigAdapter();

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

export class BasicGameConfig extends GameConfig<BasicPlayerConfig> {
  static readonly default = new BasicGameConfig(
    BasicPlayerConfig.twoPlayers,
    10,
    2,
  );

  constructor(
    players: BasicPlayerConfig[],
    readonly winningScore: number,
    readonly requiredMargin: number,
  ) {
    super(players);
  }

  with({
    players,
    winningScore,
    requiredMargin,
  }: {
    players?: BasicPlayerConfig[];
    winningScore?: number;
    requiredMargin?: number;
  }): BasicGameConfig {
    return new BasicGameConfig(
      players ?? this.players,
      winningScore ?? this.winningScore,
      requiredMargin ?? this.requiredMargin,
    );
  }
}

export class BasicGameConfigAdapter extends GameConfigAdapter<
  BasicPlayerConfig,
  BasicGameConfig
> {
  static readonly winningScore = new IntegerConfigProp("winning-score", {
    min: 1,
  });
  static readonly requiredMargin = new IntegerConfigProp("required-margin", {
    min: 1,
  });

  readonly props = [
    BasicGameConfigAdapter.winningScore,
    BasicGameConfigAdapter.requiredMargin,
  ];
  readonly defaultConfig = BasicGameConfig.default;
  readonly playerCount = PlayerCount.exactly(2);
  readonly playerConfigAdapter = new BasicPlayerConfigAdapter();

  get(config: BasicGameConfig, prop: string): unknown {
    switch (prop) {
      case BasicGameConfigAdapter.winningScore.key:
        return config.winningScore;
      case BasicGameConfigAdapter.requiredMargin.key:
        return config.requiredMargin;
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }
  set(config: BasicGameConfig, prop: string, value: unknown): BasicGameConfig {
    switch (prop) {
      case BasicGameConfigAdapter.winningScore.key:
        return config.with({
          winningScore: BasicGameConfigAdapter.winningScore.parse(value),
        });
      case BasicGameConfigAdapter.requiredMargin.key:
        return config.with({
          requiredMargin: BasicGameConfigAdapter.requiredMargin.parse(value),
        });
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }
  protected _setPlayer(
    config: BasicGameConfig,
    playerIndex: number,
    player: BasicPlayerConfig,
  ): BasicGameConfig {
    const players = [...config.players];
    players[playerIndex] = player;
    return config.with({ players });
  }
}
