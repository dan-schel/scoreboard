import { z } from "zod";
import {
  GameBuilder,
  GameInstance,
  GameState,
  ScoreType,
  type Action,
} from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";
import { IncrementAction, TennisScoreType } from "./tennis-score-type";

export class TennisBuilder extends GameBuilder<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly configWriter = new TennisConfigWriter();

  build(
    config: TennisConfig,
    uuid: string,
  ): GameInstance<TennisConfig, TennisState> {
    return new TennisGameInstance(this, config, uuid);
  }
  serializeConfig(config: TennisConfig): unknown {
    return config.toJSON();
  }
  deserializeConfig(input: unknown): TennisConfig {
    return TennisConfig.json.parse(input);
  }
}

export class TennisGameInstance extends GameInstance<
  TennisConfig,
  TennisState
> {
  getInitialState(): TennisState {
    return new TennisState(
      this.config,
      "1",
      TennisScore.zero,
      TennisScore.zero,
    );
  }
  serializeState(state: TennisState): unknown {
    return state.toJSON();
  }
  deserializeState(input: unknown): TennisState {
    return TennisState.json.parse(input)(this.config);
  }
  getScoreTypes(): ScoreType[] {
    return [new TennisScoreType("points", this.config)];
  }
}

export class TennisState extends GameState<TennisState> {
  constructor(
    readonly config: TennisConfig,
    readonly playerServing: "1" | "2",
    readonly player1Score: TennisScore,
    readonly player2Score: TennisScore,
  ) {
    super();
  }

  static readonly json = z
    .object({
      playerServing: z.enum(["1", "2"]),
      player1Score: TennisScore.json,
      player2Score: TennisScore.json,
    })
    .transform(
      (x) => (config: TennisConfig) =>
        new TennisState(
          config,
          x.playerServing,
          x.player1Score,
          x.player2Score,
        ),
    );

  toJSON(): z.input<typeof TennisState.json> {
    return {
      playerServing: this.playerServing,
      player1Score: this.player1Score.toJSON(),
      player2Score: this.player2Score.toJSON(),
    };
  }

  with({
    playerServing,
    player1Score,
    player2Score,
  }: {
    playerServing?: "1" | "2";
    player1Score?: TennisScore;
    player2Score?: TennisScore;
  }): TennisState {
    return new TennisState(
      this.config,
      playerServing ?? this.playerServing,
      player1Score ?? this.player1Score,
      player2Score ?? this.player2Score,
    );
  }

  do(action: Action): TennisState {
    if (action.id === IncrementAction.id) {
      return IncrementAction.execute(this, action.data);
    } else {
      throw new Error(`Unknown action "${action}".`);
    }
  }

  toDisplayString(): string {
    return "TODO: tennis scores";
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

    // TODO: Show when it's a tiebreak.

    if (
      this.player1Score.points === "40" &&
      this.player2Score.points === "40"
    ) {
      return "Deuce";
    }

    return null;
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
}
