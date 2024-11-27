import { type Action } from "../../game/game";
import { z } from "zod";
import type { BasicGameState } from "./basic-state";

export class IncrementAction {
  static readonly id = "increment";

  static readonly json = z.object({
    playerIndex: z.number(),
  });

  static create(
    playerIndex: number,
  ): Action<z.input<typeof IncrementAction.json>> {
    return {
      id: IncrementAction.id,
      data: {
        playerIndex: playerIndex,
      },
    };
  }

  static execute(state: BasicGameState, data: unknown): BasicGameState {
    const { playerIndex } = IncrementAction.json.parse(data);

    if (playerIndex === 0) {
      return state.with({ player1Score: state.player1Score + 1 });
    } else if (playerIndex === 1) {
      return state.with({ player2Score: state.player2Score + 1 });
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }
}
