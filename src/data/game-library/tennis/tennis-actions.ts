import type { TennisState } from "./tennis-state";
import { type Action } from "@/data/game/game";
import { z } from "zod";

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

  static execute(state: TennisState, data: unknown): TennisState {
    const { playerIndex } = IncrementAction.parse(data);
    return state.withPointAwarded(playerIndex);
  }

  static parse(data: unknown): z.output<typeof IncrementAction.json> {
    return IncrementAction.json.parse(data);
  }
}

export class FaultAction {
  static readonly id = "fault";

  static create(): Action<null> {
    return {
      id: FaultAction.id,
      data: null,
    };
  }

  static execute(state: TennisState, _data: unknown): TennisState {
    if (state.fault) {
      return state.withPointAwarded(state.playerNotServingIndex);
    } else {
      return state.with({ fault: true });
    }
  }
}
