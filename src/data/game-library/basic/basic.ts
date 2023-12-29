import {
  BasicPlayerConfig,
  BasicPlayerConfigWriter,
} from "../../game-utils/basic-player-config";
import { IntegerConfigProp } from "../../game/config-prop";
import { Game, GameState } from "../../game/game";
import {
  GameConfig,
  GameConfigWriter,
  PlayerCount,
} from "../../game/game-config";

export class BasicGame extends Game<BasicGameConfig, BasicGameState> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly configWriter = new BasicGameConfigWriter();

  initialState(_config: BasicGameConfig): BasicGameState {
    return new BasicGameState(0, 0);
  }
}

export class BasicGameState extends GameState {
  constructor(
    readonly player1Score: number,
    readonly player2Score: number,
  ) {
    super();
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

export class BasicGameConfigWriter extends GameConfigWriter<BasicGameConfig> {
  static readonly winningScore = new IntegerConfigProp("winning-score", {
    min: 1,
  });
  static readonly requiredMargin = new IntegerConfigProp("required-margin", {
    min: 1,
  });

  readonly props = [
    BasicGameConfigWriter.winningScore,
    BasicGameConfigWriter.requiredMargin,
  ];
  readonly defaultConfig = BasicGameConfig.default;
  readonly playerCount = PlayerCount.exactly(2);
  readonly playerConfigWriter = new BasicPlayerConfigWriter();

  get(config: BasicGameConfig, prop: string): unknown {
    switch (prop) {
      case BasicGameConfigWriter.winningScore.key:
        return config.winningScore;
      case BasicGameConfigWriter.requiredMargin.key:
        return config.requiredMargin;
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }

  set(config: BasicGameConfig, prop: string, value: unknown): BasicGameConfig {
    switch (prop) {
      case BasicGameConfigWriter.winningScore.key:
        return config.with({
          winningScore: BasicGameConfigWriter.winningScore.parse(value),
        });
      case BasicGameConfigWriter.requiredMargin.key:
        return config.with({
          requiredMargin: BasicGameConfigWriter.requiredMargin.parse(value),
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
