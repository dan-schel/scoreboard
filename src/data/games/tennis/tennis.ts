import { IntegerConfigProp } from "../config-prop";
import { Game, GameState, PlayerCount } from "../game";
import {
  GameConfigShape,
  GameConfig,
  type RawGameConfig,
} from "../game-config";
import { PlayerConfig, PlayerConfigShape } from "../player-config";
import { TennisScore } from "./tennis-score";

export class Tennis extends Game<PlayerConfig, TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configShape = new TennisConfigShape();

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

export class TennisConfigShape extends GameConfigShape<
  PlayerConfig,
  TennisConfig
> {
  static readonly setsToWin = new IntegerConfigProp("sets-to-win", {
    min: 1,
  });

  readonly playerCount = PlayerCount.exactly(2);
  readonly playerConfigShape = new PlayerConfigShape();
  readonly props = [TennisConfigShape.setsToWin];
  readonly defaultConfig = TennisConfig.default;

  parseGameConfig(
    values: Map<string, unknown>,
    players: PlayerConfig[],
  ): TennisConfig {
    const setsToWin = GameConfigShape.getValue(
      TennisConfigShape.setsToWin,
      values,
    );
    return new TennisConfig(players, setsToWin);
  }

  gameConfigToMap(config: TennisConfig): RawGameConfig<PlayerConfig> {
    return {
      values: new Map([[TennisConfigShape.setsToWin.key, config.setsToWin]]),
      players: config.players,
    };
  }
}

export class TennisConfig extends GameConfig<PlayerConfig> {
  static readonly default = new TennisConfig(PlayerConfig.twoPlayers, 2);

  constructor(
    players: PlayerConfig[],
    readonly setsToWin: number,
  ) {
    super(players);
  }
}
