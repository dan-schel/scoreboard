export type TennisPoints = "0" | "15" | "30" | "40" | "advantage";

export class TennisScore {
  static readonly zero = new TennisScore("0", 0, []);

  constructor(
    readonly points: TennisPoints,
    readonly games: number,
    readonly setHistory: TennisSetHistory[],
  ) {}
}

export class TennisSetHistory {
  constructor(
    readonly winner: boolean,
    readonly gamesWon: number,
  ) {}
}
