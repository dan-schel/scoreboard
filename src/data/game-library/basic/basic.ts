import { GameBuilder, GameInstance, ScoreType } from "../../game/game";
import { BasicGameConfig, BasicGameConfigWriter } from "./basic-config";
import { BasicGameState } from "./basic-state";
import { BasicScoreType } from "./basic-score-type";

export class BasicGameBuilder extends GameBuilder<
  BasicGameConfig,
  BasicGameState
> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly color = "blue";
  readonly configWriter = new BasicGameConfigWriter();

  build(
    config: BasicGameConfig,
    uuid: string,
  ): GameInstance<BasicGameConfig, BasicGameState> {
    return new BasicGameInstance(this, config, uuid);
  }
  serializeConfig(config: BasicGameConfig): unknown {
    return config.toJSON();
  }
  deserializeConfig(input: unknown): BasicGameConfig {
    return BasicGameConfig.json.parse(input);
  }
}

export class BasicGameInstance extends GameInstance<
  BasicGameConfig,
  BasicGameState
> {
  getInitialState(): BasicGameState {
    return new BasicGameState(this.config, 0, 0);
  }
  serializeState(state: BasicGameState): unknown {
    return state.toJSON();
  }
  deserializeState(input: unknown): BasicGameState {
    return BasicGameState.json.parse(input)(this.config);
  }
  getScoreType(): ScoreType {
    return new BasicScoreType("points", this.config);
  }
}
