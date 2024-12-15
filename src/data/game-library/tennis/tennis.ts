import type { EarbudInterface } from "@/data/game/earbud-interface";
import { GameBuilder, GameInstance, ScoreType } from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";
import { TennisScoreType } from "./tennis-score-type";
import { TennisState } from "./tennis-state";
import { TennisEarbudInterface } from "./tennis-earbud-interface";

export class TennisBuilder extends GameBuilder<TennisConfig, TennisState> {
  readonly id = "tennis";
  readonly name = "Tennis";
  readonly color = "green";
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
    const firstServer: "1" | "2" = {
      random: Math.random() < 0.5 ? ("1" as const) : ("2" as const),
      "player-1": "1" as const,
      "player-2": "2" as const,
    }[this.config.firstServer];

    return new TennisState(
      this.config,
      firstServer,
      TennisScore.zero,
      TennisScore.zero,
      false,
    );
  }

  serializeState(state: TennisState): unknown {
    return state.toJSON();
  }

  deserializeState(input: unknown): TennisState {
    return TennisState.json.parse(input)(this.config);
  }

  getScoreType(): ScoreType {
    return new TennisScoreType("points", this.config);
  }

  getEarbudInterface(): EarbudInterface<TennisState, string> | null {
    return new TennisEarbudInterface();
  }
}
