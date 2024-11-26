import {
  getPlayerColorDisplayString,
  type PlayerColor,
} from "@/data/game-utils/player-color";
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

export class BasicGameState extends GameState<BasicGameState> {
  constructor(
    readonly config: BasicGameConfig,
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
    .transform(
      (x) => (config: BasicGameConfig) =>
        new BasicGameState(config, x.player1Score, x.player2Score),
    );

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
      this.config,
      player1Score ?? this.player1Score,
      player2Score ?? this.player2Score,
    );
  }

  do(action: Action): BasicGameState {
    if (action.id === IncrementAction.id) {
      return IncrementAction.execute(this, action.data);
    } else {
      throw new Error(`Unknown action "${action}".`);
    }
  }

  toDisplayString(): string {
    const p1Color = getPlayerColorDisplayString(this.config.players[0].color);
    const p2Color = getPlayerColorDisplayString(this.config.players[1].color);
    const p1 = `${p1Color} ${this.player1Score.toFixed()}`;
    const p2 = `${p2Color} ${this.player2Score.toFixed()}`;
    return `${p1} - ${p2}`;
  }

  getScoreHeadline(): string | null {
    // TODO: Implement headline - if game over logic exists.
    return null;
  }

  isGameOver(): boolean | { winner: PlayerColor } {
    // TODO: Implement game over logic.
    return false;
  }
}

export class BasicScoreType extends SimpleScoreType<BasicGameState> {
  constructor(
    id: string,
    readonly config: BasicGameConfig,
  ) {
    super(id);
  }

  getPlayerColor(playerIndex: number): PlayerColor {
    return this.config.players[playerIndex].color;
  }
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
