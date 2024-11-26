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

export class BasicGameConfig extends GameConfig {
  static readonly default = new BasicGameConfig("green", "blue", 10, 2);

  constructor(
    readonly player1Color: PlayerColor,
    readonly player2Color: PlayerColor,
    readonly winningScore: number,
    readonly requiredMargin: number,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Color: z.enum(PlayerColors),
      player2Color: z.enum(PlayerColors),
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

  with({
    player1Color,
    player2Color,
    winningScore,
    requiredMargin,
  }: {
    player1Color?: PlayerColor;
    player2Color?: PlayerColor;
    winningScore?: number;
    requiredMargin?: number;
  }): BasicGameConfig {
    return new BasicGameConfig(
      player1Color ?? this.player1Color,
      player2Color ?? this.player2Color,
      winningScore ?? this.winningScore,
      requiredMargin ?? this.requiredMargin,
    );
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
          PropEnum.playerColors("green"),
        ),
        new PropObjectField(
          BasicGameConfigWriter._player2Color,
          "Player 2 Color",
          PropEnum.playerColors("blue"),
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
      .requirePlayerColor();
    const player2Color = value
      .requireEnum(BasicGameConfigWriter._player2Color)
      .requirePlayerColor();

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
      .requirePlayerColor();
    const player2Color = value
      .requireEnum(BasicGameConfigWriter._player2Color)
      .requirePlayerColor();
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
