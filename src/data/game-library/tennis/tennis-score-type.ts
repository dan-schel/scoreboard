import type { PlayerColor } from "@/data/game-utils/player-color";
import type { TennisConfig } from "./tennis-config";
import type { TennisState } from "./tennis";
import { ScoreType, type Action } from "@/data/game/game";
import { z } from "zod";
import { TennisScore } from "./tennis-score";

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
    const points = this._getScore(state, playerIndex).points;
    if (points === "advantage") {
      return "Ad.";
    } else {
      return points;
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
    const sets = [...score.setHistory.map((x) => x.gamesWon), score.games];
    return sets.map((x) => x.toFixed()).join(" ");
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
      const scoreUpdate = TennisScore.awardPoint(
        state.config,
        state.player1Score,
        state.player2Score,
      );
      return IncrementAction._buildNewState(
        state,
        scoreUpdate.winner,
        scoreUpdate.loser,
        scoreUpdate.causesChangeOfServe,
      );
    } else if (playerIndex === 1) {
      const scoreUpdate = TennisScore.awardPoint(
        state.config,
        state.player2Score,
        state.player1Score,
      );
      return IncrementAction._buildNewState(
        state,
        scoreUpdate.loser,
        scoreUpdate.winner,
        scoreUpdate.causesChangeOfServe,
      );
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  private static _buildNewState(
    state: TennisState,
    player1Score: TennisScore,
    player2Score: TennisScore,
    changeServe: boolean,
  ) {
    const playerServing = !changeServe
      ? state.playerServing
      : state.playerServing === "1"
        ? "2"
        : "1";

    return state.with({
      player1Score,
      player2Score,
      playerServing,
    });
  }
}
