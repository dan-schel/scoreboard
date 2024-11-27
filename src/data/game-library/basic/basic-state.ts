import {
  getAccentColorDisplayString,
  type AccentColor,
} from "@/data/game-utils/accent-color";
import { GameState, type Action } from "../../game/game";
import { BasicGameConfig } from "./basic-config";
import { z } from "zod";
import { IncrementAction } from "./basic-actions";

export class BasicGameState extends GameState<BasicGameState> {
  constructor(
    readonly config: BasicGameConfig,
    readonly player1Score: number,
    readonly player2Score: number,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Score: z.number(),
      player2Score: z.number(),
    })
    .transform(
      (x) => (config: BasicGameConfig) =>
        new BasicGameState(config, x.player1Score, x.player2Score),
    );

  toJSON(): z.input<typeof BasicGameState.json> {
    return {
      player1Score: this.player1Score,
      player2Score: this.player2Score,
    };
  }

  with({
    player1Score,
    player2Score,
  }: {
    player1Score?: number;
    player2Score?: number;
  }): BasicGameState {
    return new BasicGameState(
      this.config,
      player1Score ?? this.player1Score,
      player2Score ?? this.player2Score,
    );
  }

  do(action: Action): BasicGameState {
    if (action.id === IncrementAction.id) {
      return IncrementAction.execute(this, action.data);
    } else {
      throw new Error(`Unknown action "${action}".`);
    }
  }

  toDisplayString(): string {
    const p1Color = getAccentColorDisplayString(this.config.player1Color);
    const p2Color = getAccentColorDisplayString(this.config.player2Color);
    const p1 = `${p1Color} ${this.player1Score.toFixed()}`;
    const p2 = `${p2Color} ${this.player2Score.toFixed()}`;
    return `${p1} - ${p2}`;
  }

  getScoreHeadline(): string | null {
    // TODO: Implement headline - if game over logic exists.
    return null;
  }

  isGameOver(): boolean | { winner: AccentColor } {
    // TODO: Implement game over logic.
    return false;
  }
}
