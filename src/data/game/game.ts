import type { GameConfig, GameConfigWriter } from "./game-config";

export abstract class Game<
  GameConfigType extends GameConfig = GameConfig,
  GameStateType extends GameState = GameState,
> {
  abstract readonly id: string;
  abstract readonly name: string;

  abstract readonly configWriter: GameConfigWriter<GameConfigType>;

  constructor() {}

  abstract initialState(config: GameConfigType): GameStateType;
}

export abstract class GameState {
  constructor() {}
}

// export abstract class GameStateMachine<
//   GameConfigType extends GameConfig,
//   GameStateType extends GameState,
// > {
//   constructor(readonly config: GameConfigType) {}

//   abstract initialState(): GameStateType;
// }
