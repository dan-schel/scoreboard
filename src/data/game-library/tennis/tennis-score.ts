import { z } from "zod";
import type { TennisConfig } from "./tennis-config";

export const TennisGameScores = ["0", "15", "30", "40", "advantage"] as const;
export type TennisGameScore = (typeof TennisGameScores)[number];

export class TennisSetHistory {
  constructor(
    readonly winner: boolean,
    readonly gamesWon: number,
  ) {}

  static readonly json = z
    .object({
      winner: z.boolean(),
      gamesWon: z.number(),
    })
    .transform((x) => new TennisSetHistory(x.winner, x.gamesWon));

  toJSON(): z.input<typeof TennisSetHistory.json> {
    return {
      winner: this.winner,
      gamesWon: this.gamesWon,
    };
  }
}

export class TennisScore {
  static readonly zero = new TennisScore("0", null, 0, []);

  constructor(
    readonly points: TennisGameScore,
    readonly tiebreakPoints: number | null,
    readonly games: number,
    readonly setHistory: TennisSetHistory[],
  ) {}

  static readonly json = z
    .object({
      points: z.enum(TennisGameScores),
      tiebreakPoints: z.number().nullable(),
      games: z.number(),
      setHistory: TennisSetHistory.json.array(),
    })
    .transform(
      (x) => new TennisScore(x.points, x.tiebreakPoints, x.games, x.setHistory),
    );

  toJSON(): z.input<typeof TennisScore.json> {
    return {
      points: this.points,
      tiebreakPoints: this.tiebreakPoints,
      games: this.games,
      setHistory: this.setHistory.map((x) => x.toJSON()),
    };
  }

  with({
    points,
    tiebreakPoints,
    games,
    setHistory,
  }: {
    points?: TennisGameScore;
    tiebreakPoints?: number | null;
    games?: number;
    setHistory?: TennisSetHistory[];
  }): TennisScore {
    return new TennisScore(
      points ?? this.points,
      tiebreakPoints === undefined ? this.tiebreakPoints : tiebreakPoints,
      games ?? this.games,
      setHistory ?? this.setHistory,
    );
  }

  gamesWonPerSet(includeCurrentSet: boolean): number[] {
    const historic = this.setHistory.map((x) => x.gamesWon);

    if (includeCurrentSet) {
      return [...historic, this.games];
    } else {
      return historic;
    }
  }

  hasWon(setsToWin: number) {
    return this.setHistory.filter((x) => x.winner).length >= setsToWin;
  }

  static determineServeSide(
    score1: TennisScore,
    score2: TennisScore,
  ): "left" | "right" {
    if (score1.tiebreakPoints != null && score2.tiebreakPoints != null) {
      // TODO: My assumption on how the serving works during a tiebreak. IDK.
      const sum = score1.tiebreakPoints + score2.tiebreakPoints;
      return sum % 2 === 0 ? "right" : "left";
    }

    const indexSum =
      TennisGameScores.indexOf(score1.points) +
      TennisGameScores.indexOf(score2.points);
    return indexSum % 2 === 0 ? "right" : "left";
  }

  static awardPoint(
    config: TennisConfig,
    winner: TennisScore,
    loser: TennisScore,
  ): {
    winner: TennisScore;
    loser: TennisScore;
    winsGame: boolean;
    winsSet: boolean;
    winsMatch: boolean;
    causesChangeOfServe: boolean;
  } {
    const rest = {
      winner: winner,
      loser: loser,
      winsGame: false,
      winsSet: false,
      winsMatch: false,
      causesChangeOfServe: false,
    };

    if (winner.tiebreakPoints != null && loser.tiebreakPoints != null) {
      return TennisScore._awardTiebreakPoint(config, winner, loser);
    } else if (winner.points !== "40" && winner.points !== "advantage") {
      return {
        ...rest,
        winner: winner.with({
          points: TennisGameScores[TennisGameScores.indexOf(winner.points) + 1],
        }),
      };
    } else if (loser.points === "advantage") {
      return {
        ...rest,
        loser: loser.with({ points: "40" }),
      };
    } else if (loser.points === "40" && winner.points !== "advantage") {
      return {
        ...rest,
        winner: winner.with({ points: "advantage" }),
      };
    } else {
      return {
        ...TennisScore._awardGame(config, winner, loser),
        winsGame: true,
        // TODO: I'm assuming after a tiebreak/new set, the server always
        // changes like after a normal game.
        causesChangeOfServe: true,
      };
    }
  }

  private static _awardTiebreakPoint(
    config: TennisConfig,
    winner: TennisScore,
    loser: TennisScore,
  ): {
    winner: TennisScore;
    loser: TennisScore;
    winsGame: boolean;
    winsSet: boolean;
    winsMatch: boolean;
    causesChangeOfServe: boolean;
  } {
    if (winner.tiebreakPoints === null || loser.tiebreakPoints === null) {
      throw new Error("Cannot award points - this is not a tiebreak!");
    }

    const winningScore = TennisScore._getTiebreakWinningScore(
      config,
      winner,
      loser,
    );
    const requiredMargin = 2;

    const winnerPoints = winner.tiebreakPoints + 1;
    const loserPoints = loser.tiebreakPoints;

    if (
      winnerPoints >= winningScore &&
      winnerPoints - loserPoints >= requiredMargin
    ) {
      return {
        ...this._awardGame(config, winner, loser),
        winsGame: true,
        // TODO: My assumption is after a tiebreak the server always changes,
        // but maybe it changes to whoever served first in the game before the
        // tiebreak? (i.e. who didn't serve first in the tiebreak)
        causesChangeOfServe: true,
      };
    } else {
      return {
        winner: winner.with({ tiebreakPoints: winnerPoints }),
        loser: loser,
        winsGame: false,
        winsSet: false,
        winsMatch: false,
        // Switch after the first point, then every two points.
        causesChangeOfServe: (winnerPoints + loserPoints) % 2 === 1,
      };
    }
  }

  private static _awardGame(
    config: TennisConfig,
    winner: TennisScore,
    loser: TennisScore,
  ): {
    winner: TennisScore;
    loser: TennisScore;
    winsSet: boolean;
    winsMatch: boolean;
  } {
    if (winner.games < 5 || (winner.games === 5 && loser.games === 5)) {
      return {
        winner: winner.with({
          points: "0",
          tiebreakPoints: null,
          games: winner.games + 1,
        }),
        loser: loser.with({ points: "0", tiebreakPoints: null }),
        winsSet: false,
        winsMatch: false,
      };
    } else if (winner.games === 5 && loser.games === 6) {
      return {
        winner: winner.with({
          points: "0",
          tiebreakPoints: 0,
          games: winner.games + 1,
        }),
        loser: loser.with({ points: "0", tiebreakPoints: 0 }),
        winsSet: false,
        winsMatch: false,
      };
    } else {
      const winnerSetHistory = winner.setHistory.concat(
        new TennisSetHistory(true, winner.games + 1),
      );
      const loserSetHistory = loser.setHistory.concat(
        new TennisSetHistory(false, loser.games),
      );

      const newWinnerScore = winner.with({
        points: "0",
        tiebreakPoints: null,
        games: 0,
        setHistory: winnerSetHistory,
      });
      const newLoserScore = loser.with({
        points: "0",
        tiebreakPoints: null,
        games: 0,
        setHistory: loserSetHistory,
      });

      return {
        winner: newWinnerScore,
        loser: newLoserScore,
        winsSet: true,
        winsMatch: newWinnerScore.hasWon(config.setsToWin),
      };
    }
  }

  private static _getTiebreakWinningScore(
    config: TennisConfig,
    score1: TennisScore,
    // You don't really need to know both player's scores to know which set
    // we're in. Shrug.
    _score2: TennisScore,
  ) {
    if (config.tiebreakRule === "always-to-7") {
      return 7;
    } else if (config.tiebreakRule === "always-to-10") {
      return 10;
    } else {
      const setNumber = score1.setHistory.length + 1;
      const isLastSet = setNumber === config.setsToWin * 2 - 1;
      return isLastSet ? 10 : 7;
    }
  }
}
