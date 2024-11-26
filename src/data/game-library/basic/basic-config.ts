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

export class BasicGameConfig extends GameConfig {
  constructor(
    readonly player1Color: AccentColor,
    readonly player2Color: AccentColor,
    readonly winningScore: number,
    readonly requiredMargin: number,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Color: z.enum(AccentColors),
      player2Color: z.enum(AccentColors),
      winningScore: z.number(),
      requiredMargin: z.number(),
    })
    .transform(
      (x) =>
        new BasicGameConfig(
          x.player1Color,
          x.player2Color,
          x.winningScore,
          x.requiredMargin,
        ),
    );

  toJSON(): z.input<typeof BasicGameConfig.json> {
    return {
      player1Color: this.player1Color,
      player2Color: this.player2Color,
      winningScore: this.winningScore,
      requiredMargin: this.requiredMargin,
    };
  }

  toDisplayString(): string {
    throw new Error("Method not implemented.");
  }

  getPlayerCount(): number {
    return 2;
  }
}

export class BasicGameConfigWriter extends GameConfigWriter<BasicGameConfig> {
  private static _player1Color = "player-1-color";
  private static _player2Color = "player-2-color";
  private static _winningScore = "winning-score";
  private static _requiredMargin = "required-margin";

  constructor() {
    super(
      new PropObject([
        new PropObjectField(
          BasicGameConfigWriter._player1Color,
          "Player 1 Color",
          PropEnum.accentColors("green"),
        ),
        new PropObjectField(
          BasicGameConfigWriter._player2Color,
          "Player 2 Color",
          PropEnum.accentColors("blue"),
        ),
        new PropObjectField(
          BasicGameConfigWriter._winningScore,
          "Winning Score",
          new PropInteger(10, 1, null),
        ),
        new PropObjectField(
          BasicGameConfigWriter._requiredMargin,
          "Required Margin",
          new PropInteger(2, 1, null),
        ),
      ]),
    );
  }

  doAdditionalValidation(value: PropObjectValue): PropObjectValue {
    const player1Color = value
      .requireEnum(BasicGameConfigWriter._player1Color)
      .requireAccentColor();
    const player2Color = value
      .requireEnum(BasicGameConfigWriter._player2Color)
      .requireAccentColor();

    if (player1Color === player2Color) {
      return new PropObjectValue(
        value.fields,
        "Player colors must be different.",
      );
    }

    return value;
  }

  build(value: PropObjectValue): BasicGameConfig {
    const player1Color = value
      .requireEnum(BasicGameConfigWriter._player1Color)
      .requireAccentColor();
    const player2Color = value
      .requireEnum(BasicGameConfigWriter._player2Color)
      .requireAccentColor();
    const winningScore = value
      .requireInteger(BasicGameConfigWriter._winningScore)
      .require();
    const requiredMargin = value
      .requireInteger(BasicGameConfigWriter._requiredMargin)
      .require();

    return new BasicGameConfig(
      player1Color,
      player2Color,
      winningScore,
      requiredMargin,
    );
  }
}
