import type { PlayerColor } from "@/data/game-utils/player-color";
import type { TennisConfig } from "./tennis-config";
import type { TennisState } from "./tennis-state";
import { ScoreType, type Action } from "@/data/game/game";
import { FaultAction, IncrementAction } from "./tennis-actions";

export class TennisScoreType extends ScoreType {
  constructor(
    id: string,
    readonly config: TennisConfig,
  ) {
    super(id);
  }

  getPlayerColor(playerIndex: number): PlayerColor {
    if (playerIndex === 0) {
      return this.config.player1Color;
    } else if (playerIndex === 1) {
      return this.config.player2Color;
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  getPrimaryScoreString(state: TennisState, playerIndex: number): string {
    const score = this._getScore(state, playerIndex);
    if (score.tiebreakPoints != null) {
      return score.tiebreakPoints.toFixed();
    } else if (score.points === "advantage") {
      return "Ad.";
    } else {
      return score.points;
    }
  }

  getSetHistoryString(state: TennisState, playerIndex: number): string {
    const score = this._getScore(state, playerIndex);
    if (
      score.setHistory.length === 0 &&
      state.player1Score.games === 0 &&
      state.player2Score.games === 0
    ) {
      return "";
    }
    return score
      .gamesWonPerSet()
      .map((x) => x.toFixed())
      .join(" ");
  }

  private _getScore(state: TennisState, playerIndex: number) {
    if (playerIndex === 0) {
      return state.player1Score;
    } else if (playerIndex === 1) {
      return state.player2Score;
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  isFault(state: TennisState): boolean {
    return state.fault;
  }

  canIncrementScore(_state: TennisState): boolean {
    // TODO: Check for game over?
    return true;
  }

  getIncrementAction(playerIndex: number): Action {
    return IncrementAction.create(playerIndex);
  }

  canFault(state: TennisState, playerIndex: number): boolean {
    // TODO: Check for game over?
    return state.isServing(playerIndex);
  }

  getFaultAction(): Action {
    return FaultAction.create();
  }
}
