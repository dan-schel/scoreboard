import { z } from "zod";
import { GameState, type Action } from "../../game/game";
import { TennisConfig } from "./tennis-config";
import { TennisScore } from "./tennis-score";
import {
  getPlayerColorDisplayString,
  type PlayerColor,
} from "@/data/game-utils/player-color";
import { FaultAction, IncrementAction } from "./tennis-actions";

export class TennisState extends GameState<TennisState> {
  // TODO: Implement configuration.
  constructor(
    readonly config: TennisConfig,
    readonly playerServing: "1" | "2",
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
    readonly fault: boolean,
  ) {
    super();
  }

  static readonly json = z
    .object({
      playerServing: z.enum(["1", "2"]),
      player1Score: TennisScore.json,
      player2Score: TennisScore.json,
      fault: z.boolean(),
    })
    .transform(
      (x) => (config: TennisConfig) =>
        new TennisState(
          config,
          x.playerServing,
          x.player1Score,
          x.player2Score,
          x.fault,
        ),
    );

  toJSON(): z.input<typeof TennisState.json> {
    return {
      playerServing: this.playerServing,
      player1Score: this.player1Score.toJSON(),
      player2Score: this.player2Score.toJSON(),
      fault: this.fault,
    };
  }

  with({
    playerServing,
    player1Score,
    player2Score,
    fault,
  }: {
    playerServing?: "1" | "2";
    player1Score?: TennisScore;
    player2Score?: TennisScore;
    fault?: boolean;
  }): TennisState {
    return new TennisState(
      this.config,
      playerServing ?? this.playerServing,
      player1Score ?? this.player1Score,
      player2Score ?? this.player2Score,
      fault ?? this.fault,
    );
  }

  do(action: Action): TennisState {
    if (action.id === IncrementAction.id) {
      return IncrementAction.execute(this, action.data);
    } else if (action.id === FaultAction.id) {
      return FaultAction.execute(this, action.data);
    } else {
      throw new Error(`Unknown action "${action}".`);
    }
  }

  toDisplayString(): string {
    const p1Color = getPlayerColorDisplayString(this.config.players[0].color);
    const p2Color = getPlayerColorDisplayString(this.config.players[1].color);

    const p1Sets = this.player1Score
      .gamesWonPerSet()
      .map((x) => x.toFixed())
      .join(" ");
    const p2Sets = this.player2Score
      .gamesWonPerSet()
      .map((x) => x.toFixed())
      .join(" ");

    return `${p1Color} ${p1Sets} - ${p2Color} ${p2Sets}`;
  }

  getScoreHeadline(): string | null {
    const scoresAfterPlayer1Wins = TennisScore.awardPoint(
      this.config,
      this.player1Score,
      this.player2Score,
    );
    const scoresAfterPlayer2Wins = TennisScore.awardPoint(
      this.config,
      this.player2Score,
      this.player1Score,
    );

    if (scoresAfterPlayer1Wins.winsMatch || scoresAfterPlayer2Wins.winsMatch) {
      return "Match point";
    }
    if (scoresAfterPlayer1Wins.winsSet || scoresAfterPlayer2Wins.winsSet) {
      return "Set point";
    }

    if (scoresAfterPlayer1Wins.winsGame && this.playerServing !== "1") {
      return "Break point";
    }
    if (scoresAfterPlayer2Wins.winsGame && this.playerServing !== "2") {
      return "Break point";
    }

    if (
      this.player1Score.tiebreakPoints != null &&
      this.player2Score.tiebreakPoints != null
    ) {
      return "Tiebreak";
    }

    if (
      this.player1Score.points === "40" &&
      this.player2Score.points === "40"
    ) {
      return "Deuce";
    }

    return null;
  }

  isGameOver(): boolean | { winner: PlayerColor } {
    if (this.player1Score.hasWon(this.config.setsToWin)) {
      return { winner: this.config.players[0].color };
    }
    if (this.player2Score.hasWon(this.config.setsToWin)) {
      return { winner: this.config.players[1].color };
    }
    return false;
  }

  isServing(playerIndex: number): boolean {
    if (playerIndex === 0) {
      return this.playerServing === "1";
    } else if (playerIndex === 1) {
      return this.playerServing === "2";
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }

  get playerServingIndex(): 0 | 1 {
    return this.playerServing === "1" ? 0 : 1;
  }

  get playerNotServing(): "1" | "2" {
    return this.playerServing === "1" ? "2" : "1";
  }

  get playerNotServingIndex(): 0 | 1 {
    return this.playerServing === "1" ? 1 : 0;
  }

  withPointAwarded(playerIndex: number) {
    const newState = (
      player1Score: TennisScore,
      player2Score: TennisScore,
      changeServe: boolean,
    ) => {
      const playerServing = !changeServe
        ? this.playerServing
        : this.playerNotServing;

      return this.with({
        player1Score,
        player2Score,
        playerServing,
        fault: false,
      });
    };

    if (playerIndex === 0) {
      const scoreUpdate = TennisScore.awardPoint(
        this.config,
        this.player1Score,
        this.player2Score,
      );
      return newState(
        scoreUpdate.winner,
        scoreUpdate.loser,
        scoreUpdate.causesChangeOfServe,
      );
    } else if (playerIndex === 1) {
      const scoreUpdate = TennisScore.awardPoint(
        this.config,
        this.player2Score,
        this.player1Score,
      );
      return newState(
        scoreUpdate.loser,
        scoreUpdate.winner,
        scoreUpdate.causesChangeOfServe,
      );
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }
}
