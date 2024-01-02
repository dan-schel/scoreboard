import {
  GameBuilder,
  GameInstance,
  GameState,
  SimpleScoreType,
  ScoreType,
  type Action,
} from "../../game/game";
import { BasicGameConfig, BasicGameConfigWriter } from "./basic-config";
import { z } from "zod";

export class BasicGameBuilder extends GameBuilder<
  BasicGameConfig,
  BasicGameState
> {
  readonly id = "basic";
  readonly name = "Basic";
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
    return new BasicGameState(0, 0);
  }
  serializeState(state: BasicGameState): unknown {
    return state.toJSON();
  }
  deserializeState(input: unknown): BasicGameState {
    return BasicGameState.json.parse(input);
  }
  getScoreTypes(): ScoreType[] {
    return [new BasicScoreType("points")];
  }
}

export class BasicGameState extends GameState<BasicGameConfig, BasicGameState> {
  constructor(
    readonly player1Score: number,
    readonly player2Score: number,
  ) {
    super();
  }

  static readonly json = z
    .object({
      player1Score: z.number(),
      player2Score: z.number(),
    })
    .transform((x) => new BasicGameState(x.player1Score, x.player2Score));

  toJSON(): z.input<typeof BasicGameState.json> {
    return {
      player1Score: this.player1Score,
      player2Score: this.player2Score,
    };
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

  do(action: Action, _config: BasicGameConfig): BasicGameState {
    if (action.id === IncrementAction.id) {
      return IncrementAction.execute(this, action.data);
    } else {
      throw new Error(`Unknown action "${action}".`);
    }
  }
}

export class BasicScoreType extends SimpleScoreType<BasicGameState> {
  getScoreString(state: BasicGameState, playerIndex: number): string {
    if (playerIndex === 0) {
      return state.player1Score.toFixed();
    } else if (playerIndex === 1) {
      return state.player2Score.toFixed();
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }
  canIncrementScore(_state: BasicGameState, _playerIndex: number): boolean {
    return true;
  }
  getIncrementAction(_state: BasicGameState, playerIndex: number): Action {
    return IncrementAction.create(playerIndex);
  }
}

class IncrementAction {
  static readonly id = "increment";

  static readonly json = z.object({
    playerIndex: z.number(),
  });

  static create(
    playerIndex: number,
  ): Action<z.input<typeof IncrementAction.json>> {
    return {
      id: IncrementAction.id,
      data: {
        playerIndex: playerIndex,
      },
    };
  }

  static execute(state: BasicGameState, data: unknown): BasicGameState {
    const { playerIndex } = IncrementAction.json.parse(data);

    if (playerIndex === 0) {
      return state.with({ player1Score: state.player1Score + 1 });
    } else if (playerIndex === 1) {
      return state.with({ player2Score: state.player2Score + 1 });
    } else {
      throw new Error(`Invalid player index "${playerIndex}".`);
    }
  }
}
