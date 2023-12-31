import {
  GameBuilder,
  GameInstance,
  GameState,
  ScoreType,
} from "../../game/game";
import { BasicGameConfig, BasicGameConfigWriter } from "./basic-config";

export class BasicGameBuilder extends GameBuilder<
  BasicGameConfig,
  BasicGameState
> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly configWriter = new BasicGameConfigWriter();

  build(
    config: BasicGameConfig,
  ): GameInstance<BasicGameConfig, BasicGameState> {
    return new BasicGameInstance(config);
  }
}

export class BasicGameState extends GameState {
  constructor(
    readonly player1Score: number,
    readonly player2Score: number,
  ) {
    super();
  }

  with({
    player1Score,
    player2Score,
  }: {
    player1Score?: number;
    player2Score?: number;
  }): BasicGameState {
    return new BasicGameState(
      player1Score ?? this.player1Score,
      player2Score ?? this.player2Score,
    );
  }
}

export class BasicGameInstance extends GameInstance<
  BasicGameConfig,
  BasicGameState
> {
  getInitialState(): BasicGameState {
    return new BasicGameState(0, 0);
  }

  getScoreTypes(): ScoreType[] {}

  canIncrementScore(
    state: BasicGameState,
    scoreID: string,
    playerIndex: number,
  ): boolean {}

  incrementScore(
    state: BasicGameState,
    scoreID: string,
    playerIndex: number,
  ): BasicGameState {}
}
