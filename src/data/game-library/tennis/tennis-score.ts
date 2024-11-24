import { z } from "zod";

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

  static determineServeSide(
    score1: TennisScore,
    score2: TennisScore,
  ): "left" | "right" {
    // TODO: Calculate serve side based on score.
    return "right";
  }
}
