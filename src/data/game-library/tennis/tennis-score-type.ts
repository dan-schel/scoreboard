import type { PlayerColor } from "@/data/game-utils/player-color";
import type { TennisConfig } from "./tennis-config";
import type { TennisState } from "./tennis";
import { ScoreType, type Action } from "@/data/game/game";
import { z } from "zod";

export class TennisScoreType extends ScoreType {
  constructor(
    id: string,
    readonly config: TennisConfig,
  ) {
    super(id);
  }

  getPlayerColor(playerIndex: number): PlayerColor {
    return this.config.players[playerIndex].color;
  }

  getPrimaryScoreString(state: TennisState, playerIndex: number): string {
    if (playerIndex === 0) {
      return state.player1Score.points;
    } else if (playerIndex === 1) {
      return state.player2Score.points;
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  canIncrementScore(_state: TennisState, _playerIndex: number): boolean {
    return true;
  }

  getIncrementAction(_state: TennisState, playerIndex: number): Action {
    return IncrementAction.create(playerIndex);
  }
}

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
    const { playerIndex } = IncrementAction.json.parse(data);

    if (playerIndex === 0) {
      return state;
      // TODO: return state.with({ player1Score: state.player1Score + 1 });
    } else if (playerIndex === 1) {
      return state;
      // TODO: return state.with({ player2Score: state.player2Score + 1 });
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }
}
