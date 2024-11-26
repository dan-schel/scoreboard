import { GameBuilder, GameInstance, ScoreType } from "../../game/game";
import { TennisConfig, TennisConfigWriter } from "./tennis-config";
import { TennisScore } from "./tennis-score";
import { TennisScoreType } from "./tennis-score-type";
import { TennisState } from "./tennis-state";

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
}
