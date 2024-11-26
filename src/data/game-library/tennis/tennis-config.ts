import { PlayerColors, type PlayerColor } from "@/data/game-utils/player-color";
import { GameConfig, GameConfigWriter } from "@/data/game/config/config";
import type { Validated } from "@/data/game/config/prop";
import { PropInteger } from "@/data/game/config/prop-integer";
import {
  PropObject,
  PropObjectField,
  type PropObjectValue,
} from "@/data/game/config/prop-object";
import { z } from "zod";

export class TennisConfig extends GameConfig {
  static readonly default = new TennisConfig("green", "blue", 2);

  constructor(
    readonly player1Color: PlayerColor,
    readonly player2Color: PlayerColor,
    readonly setsToWin: number,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Color: z.enum(PlayerColors),
      player2Color: z.enum(PlayerColors),
      setsToWin: z.number(),
    })
    .transform(
      (x) => new TennisConfig(x.player1Color, x.player2Color, x.setsToWin),
    );

  toJSON(): z.input<typeof TennisConfig.json> {
    return {
      player1Color: this.player1Color,
      player2Color: this.player2Color,
      setsToWin: this.setsToWin,
    };
  }

  toDisplayString(): string {
    throw new Error("Method not implemented.");
  }

  getPlayerCount(): number {
    return 2;
  }

  with({
    player1Color,
    player2Color,
    setsToWin,
  }: {
    player1Color?: PlayerColor;
    player2Color?: PlayerColor;
    setsToWin?: number;
  }): TennisConfig {
    return new TennisConfig(
      player1Color ?? this.player1Color,
      player2Color ?? this.player2Color,
      setsToWin ?? this.setsToWin,
    );
  }
}

export class TennisConfigWriter extends GameConfigWriter<TennisConfig> {
  private static _player1Color = "player-1-color";
  private static _player2Color = "player-2-color";
  private static _setsToWin = "sets-to-win";

  constructor() {
    super(
      new PropObject([
        // TODO: Not implemented yet.
        new PropObjectField(
          TennisConfigWriter._player1Color,
          "Player 1 Color",
          new PropInteger(0, null, null),
        ),
        new PropObjectField(
          TennisConfigWriter._player2Color,
          "Player 2 Color",
          new PropInteger(0, null, null),
        ),

        new PropObjectField(
          TennisConfigWriter._setsToWin,
          "Sets to win",
          new PropInteger(2, 1, null),
        ),
      ]),
    );
  }

  doAdditionalValidation(values: PropObjectValue): Validated<PropObjectValue> {
    // Nothing further to validate.
    return { isValid: true, validated: values };
  }

  build(values: PropObjectValue): TennisConfig {
    const setsToWin = values
      .requireInteger(TennisConfigWriter._setsToWin)
      .require();

    return new TennisConfig(
      // TODO: Not implemented yet.
      "green",
      "blue",

      setsToWin,
    );
  }
}
