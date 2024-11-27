import { AccentColors, type AccentColor } from "@/data/game-utils/accent-color";
import { GameConfig, GameConfigWriter } from "@/data/game/config/config";
import { PropEnum } from "@/data/game/config/prop-enum";
import { PropInteger } from "@/data/game/config/prop-integer";
import {
  PropObject,
  PropObjectField,
  PropObjectValue,
} from "@/data/game/config/prop-object";
import { z } from "zod";

export const TiebreakRules = [
  "always-to-7",
  "always-to-10",
  "last-set-10-otherwise-7",
] as const;
export type TiebreakRule = (typeof TiebreakRules)[number];

export const FirstServers = ["random", "player-1", "player-2"] as const;
export type FirstServer = (typeof FirstServers)[number];

export class TennisConfig extends GameConfig {
  constructor(
    readonly player1Color: AccentColor,
    readonly player2Color: AccentColor,
    readonly setsToWin: number,
    readonly tiebreakRule: TiebreakRule,
    readonly firstServer: FirstServer,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Color: z.enum(AccentColors),
      player2Color: z.enum(AccentColors),
      setsToWin: z.number(),
      tiebreakRule: z.enum(TiebreakRules),
      firstServer: z.enum(FirstServers),
    })
    .transform(
      (x) =>
        new TennisConfig(
          x.player1Color,
          x.player2Color,
          x.setsToWin,
          x.tiebreakRule,
          x.firstServer,
        ),
    );

  toJSON(): z.input<typeof TennisConfig.json> {
    return {
      player1Color: this.player1Color,
      player2Color: this.player2Color,
      setsToWin: this.setsToWin,
      tiebreakRule: this.tiebreakRule,
      firstServer: this.firstServer,
    };
  }

  toDisplayString(): string {
    throw new Error("Method not implemented.");
  }

  getPlayerCount(): number {
    return 2;
  }
}

export class TennisConfigWriter extends GameConfigWriter<TennisConfig> {
  private static _player1Color = "player-1-color";
  private static _player2Color = "player-2-color";
  private static _setsToWin = "sets-to-win";
  private static _tiebreakRule = "tiebreak-rule";
  private static _firstServer = "first-server";

  constructor() {
    super(
      new PropObject([
        new PropObjectField(
          TennisConfigWriter._player1Color,
          "Player 1 Color",
          PropEnum.accentColors("green"),
        ),
        new PropObjectField(
          TennisConfigWriter._player2Color,
          "Player 2 Color",
          PropEnum.accentColors("blue"),
        ),
        new PropObjectField(
          TennisConfigWriter._setsToWin,
          "Sets to win",
          new PropInteger(2, 1, null),
        ),
        new PropObjectField(
          TennisConfigWriter._tiebreakRule,
          "Number of points in a tiebreak",
          PropEnum.fromArray<TiebreakRule>(
            TiebreakRules,
            {
              "always-to-10": "Always 10",
              "always-to-7": "Always 7",
              "last-set-10-otherwise-7": "10 for the last set, otherwise 7",
            },
            "last-set-10-otherwise-7",
          ),
        ),
        new PropObjectField(
          TennisConfigWriter._firstServer,
          "Player to serve first",
          PropEnum.fromArray<FirstServer>(
            FirstServers,
            {
              random: "Random",
              "player-1": "Player 1",
              "player-2": "Player 2",
            },
            "random",
          ),
        ),
      ]),
    );
  }

  doAdditionalValidation(value: PropObjectValue): PropObjectValue {
    const player1Color = value
      .requireEnum(TennisConfigWriter._player1Color)
      .requireAccentColor();
    const player2Color = value
      .requireEnum(TennisConfigWriter._player2Color)
      .requireAccentColor();

    if (player1Color === player2Color) {
      return new PropObjectValue(
        value.fields,
        "Player colors must be different.",
      );
    }

    return value;
  }

  build(value: PropObjectValue): TennisConfig {
    const player1Color = value
      .requireEnum(TennisConfigWriter._player1Color)
      .requireAccentColor();
    const player2Color = value
      .requireEnum(TennisConfigWriter._player2Color)
      .requireAccentColor();
    const setsToWin = value
      .requireInteger(TennisConfigWriter._setsToWin)
      .require();
    const tiebreakRule = value
      .requireEnum(TennisConfigWriter._tiebreakRule)
      .requireOneOf<TiebreakRule>(TiebreakRules);
    const firstServer = value
      .requireEnum(TennisConfigWriter._firstServer)
      .requireOneOf<FirstServer>(FirstServers);

    return new TennisConfig(
      player1Color,
      player2Color,
      setsToWin,
      tiebreakRule,
      firstServer,
    );
  }
}
