import type { GameConfig, GameConfigAdapter } from "./game-config";
import type { PlayerConfig } from "./player-config";

export abstract class Game<
  PlayerConfigType extends PlayerConfig = PlayerConfig,
  GameConfigType extends
    GameConfig<PlayerConfigType> = GameConfig<PlayerConfigType>,
  GameStateType extends GameState = GameState,
> {
  abstract readonly id: string;
  abstract readonly name: string;

  abstract readonly configAdapter: GameConfigAdapter<
    PlayerConfigType,
    GameConfigType
  >;

  constructor() {}

  abstract initialState(config: GameConfigType): GameStateType;
}

export abstract class GameState<
  GameConfigType extends GameConfig<any> = GameConfig<any>,
> {
  constructor(readonly config: GameConfigType) {}
}
