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
  static readonly zero = new TennisScore("0", 0, []);

  // TODO: Nothing here accounts for tiebreaks! Should I track tiebreak points
  // in a separate field `tiebreakPoints`, or add it new values to
  // TennisGameScores? Keep in mind that tiebreaks can go on indefinitely,
  // there's no max score. (If doing the latter, I can use a type like
  // "T-${number}", but rn I'm leaning towards the `tiebreakPoints` idea.)
  //
  // I'm also not tracking faults here, but I think those should be tracked in
  // the TennisState itself (we don't need two separate values for each player,
  // since only one player serves at a time). Then if the fault button is
  // pressed twice, call TennisScore.awardPoint() just like we do in
  // IncrementAction.
  constructor(
    readonly points: TennisGameScore,
    readonly games: number,
    readonly setHistory: TennisSetHistory[],
  ) {}

  static readonly json = z
    .object({
      points: z.enum(TennisGameScores),
      games: z.number(),
      setHistory: TennisSetHistory.json.array(),
    })
    .transform((x) => new TennisScore(x.points, x.games, x.setHistory));

  toJSON(): z.input<typeof TennisScore.json> {
    return {
      points: this.points,
      games: this.games,
      setHistory: this.setHistory.map((x) => x.toJSON()),
    };
  }

  with({
    points,
    games,
    setHistory,
  }: {
    points?: TennisGameScore;
    games?: number;
    setHistory?: TennisSetHistory[];
  }): TennisScore {
    return new TennisScore(
      points ?? this.points,
      games ?? this.games,
      setHistory ?? this.setHistory,
    );
  }

  static determineServeSide(
    score1: TennisScore,
    score2: TennisScore,
  ): "left" | "right" {
    // TODO: Tiebreak stuff.

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

    // Because tiebreaks cause a change of serve even two points, even when
    // winsGame is false.
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

    // eslint-disable-next-line no-constant-condition
    if (false /* TODO: Is tiebreak. */) {
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
        // I'm assuming on a tiebreak/new set, the server always changes like
        // after a normal game.
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
    // Increment the points, track the changes of serve every two points, and
    // call _awardGame when someone wins the tiebreak.
    throw new Error("Not implemented.");
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
        winner: winner.with({ points: "0", games: winner.games + 1 }),
        loser: loser.with({ points: "0" }),
        winsSet: false,
        winsMatch: false,
      };
    } else if (winner.games === 5 && loser.games === 6) {
      // TODO: Go to a tiebreak!
      throw new Error("Not implemented.");
    } else {
      const winnerSetHistory = winner.setHistory.concat(
        new TennisSetHistory(true, winner.games + 1),
      );
      const loserSetHistory = loser.setHistory.concat(
        new TennisSetHistory(false, loser.games),
      );

      const winsMatch =
        winnerSetHistory.filter((x) => x.winner).length >= config.setsToWin;

      return {
        winner: winner.with({
          points: "0",
          games: 0,
          setHistory: winnerSetHistory,
        }),
        loser: loser.with({
          points: "0",
          games: 0,
          setHistory: loserSetHistory,
        }),
        winsSet: true,
        winsMatch,
      };
    }
  }
}
