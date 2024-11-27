import { type AccentColor } from "@/data/game-utils/accent-color";
import { SimpleScoreType, type Action } from "../../game/game";
import { BasicGameConfig } from "./basic-config";
import type { BasicGameState } from "./basic-state";
import { IncrementAction } from "./basic-actions";

export class BasicScoreType extends SimpleScoreType<BasicGameState> {
  constructor(
    id: string,
    readonly config: BasicGameConfig,
  ) {
    super(id);
  }

  getPlayerColor(playerIndex: number): AccentColor {
    if (playerIndex === 0) {
      return this.config.player1Color;
    } else if (playerIndex === 1) {
      return this.config.player2Color;
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  getScoreString(state: BasicGameState, playerIndex: number): string {
    if (playerIndex === 0) {
      return state.player1Score.toFixed();
    } else if (playerIndex === 1) {
      return state.player2Score.toFixed();
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  canIncrementScore(_state: BasicGameState, _playerIndex: number): boolean {
    return true;
  }

  getIncrementAction(_state: BasicGameState, playerIndex: number): Action {
    return IncrementAction.create(playerIndex);
  }
}
