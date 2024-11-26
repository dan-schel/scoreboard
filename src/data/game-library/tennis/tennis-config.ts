import { PlayerColors, type PlayerColor } from "@/data/game-utils/player-color";
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

export class TennisConfig extends GameConfig {
  constructor(
    readonly player1Color: PlayerColor,
    readonly player2Color: PlayerColor,
    readonly setsToWin: number,
    readonly tiebreakRule: TiebreakRule,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Color: z.enum(PlayerColors),
      player2Color: z.enum(PlayerColors),
      setsToWin: z.number(),
      tiebreakRule: z.enum(TiebreakRules),
    })
    .transform(
      (x) =>
        new TennisConfig(
          x.player1Color,
          x.player2Color,
          x.setsToWin,
          x.tiebreakRule,
        ),
    );

  toJSON(): z.input<typeof TennisConfig.json> {
    return {
      player1Color: this.player1Color,
      player2Color: this.player2Color,
      setsToWin: this.setsToWin,
      tiebreakRule: this.tiebreakRule,
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

  constructor() {
    super(
      new PropObject([
        new PropObjectField(
          TennisConfigWriter._player1Color,
          "Player 1 Color",
          PropEnum.playerColors("green"),
        ),
        new PropObjectField(
          TennisConfigWriter._player2Color,
          "Player 2 Color",
          PropEnum.playerColors("blue"),
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
      ]),
    );
  }

  doAdditionalValidation(value: PropObjectValue): PropObjectValue {
    const player1Color = value
      .requireEnum(TennisConfigWriter._player1Color)
      .requirePlayerColor();
    const player2Color = value
      .requireEnum(TennisConfigWriter._player2Color)
      .requirePlayerColor();

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
      .requirePlayerColor();
    const player2Color = value
      .requireEnum(TennisConfigWriter._player2Color)
      .requirePlayerColor();
    const setsToWin = value
      .requireInteger(TennisConfigWriter._setsToWin)
      .require();
    const tiebreakRule = value
      .requireEnum(TennisConfigWriter._tiebreakRule)
      .requireOneOf<TiebreakRule>(TiebreakRules);

    return new TennisConfig(
      player1Color,
      player2Color,
      setsToWin,
      tiebreakRule,
    );
  }
}
