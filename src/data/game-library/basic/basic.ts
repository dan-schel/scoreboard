import { Game, GameState, ScoreSystem } from "../../game/game";
import { BasicGameConfig, BasicGameConfigWriter } from "./basic-config";

export class BasicGame extends Game<BasicGameConfig, BasicGameState> {
  readonly id = "basic";
  readonly name = "Basic";
  readonly configWriter = new BasicGameConfigWriter();

  getInitialState(_config: BasicGameConfig): BasicGameState {
    return new BasicGameState(0, 0);
  }

  getScoreSystem(_config: BasicGameConfig): ScoreSystem {
    // return new BasicScoreSystem(config);
    return new BasicScoreSystem();
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

export class BasicScoreSystem extends ScoreSystem {
  // constructor(private readonly _config: BasicGameConfig) {
  //   super();
  // }

  getScore(state: BasicGameState, playerIndex: number): number {
    if (playerIndex === 0) {
      return state.player1Score;
    } else if (playerIndex === 1) {
      return state.player2Score;
    } else {
      throw new Error("Invalid player index");
    }
  }

  incrementScore(state: BasicGameState, playerIndex: number): BasicGameState {
    if (playerIndex === 0) {
      return state.with({ player1Score: state.player1Score + 1 });
    } else if (playerIndex === 1) {
      return state.with({ player2Score: state.player2Score + 1 });
    } else {
      throw new Error("Invalid player index");
    }
  }
}
