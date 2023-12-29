import {
  BasicPlayerConfig,
  BasicPlayerConfigWriter,
} from "../../game-utils/basic-player-config";
import { IntegerConfigProp } from "../../game/config-prop";
import {
  GameConfigWriter,
  PlayerCount,
  GameConfig,
} from "../../game/game-config";

export class TennisConfig extends GameConfig<BasicPlayerConfig> {
  static readonly default = new TennisConfig(BasicPlayerConfig.twoPlayers, 2);

  constructor(
    players: BasicPlayerConfig[],
    readonly setsToWin: number,
  ) {
    super(players);
  }

  with({
    players,
    setsToWin,
  }: {
    players?: BasicPlayerConfig[];
    setsToWin?: number;
  }): TennisConfig {
    return new TennisConfig(
      players ?? this.players,
      setsToWin ?? this.setsToWin,
    );
  }
}

export class TennisConfigWriter extends GameConfigWriter<TennisConfig> {
  static readonly setsToWin = new IntegerConfigProp("sets-to-win", {
    min: 1,
  });

  readonly props = [TennisConfigWriter.setsToWin];
  readonly defaultConfig = TennisConfig.default;
  readonly playerCount = PlayerCount.exactly(2);
  readonly playerConfigWriter = new BasicPlayerConfigWriter();

  get(config: TennisConfig, prop: string): unknown {
    switch (prop) {
      case TennisConfigWriter.setsToWin.key:
        return config.setsToWin;
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }

  set(config: TennisConfig, prop: string, value: unknown): TennisConfig {
    switch (prop) {
      case TennisConfigWriter.setsToWin.key:
        return config.with({
          setsToWin: TennisConfigWriter.setsToWin.parse(value),
        });
      default:
        throw new Error(`Unknown prop "${prop}".`);
    }
  }

  protected _setPlayer(
    config: TennisConfig,
    playerIndex: number,
    player: BasicPlayerConfig,
  ): TennisConfig {
    const players = [...config.players];
    players[playerIndex] = player;
    return config.with({ players });
  }
}
