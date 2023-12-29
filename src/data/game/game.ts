import type { GameConfig, GameConfigAdapter } from "./game-config";
import type { PlayerConfig } from "./player-config";

export abstract class Game<
  PlayerConfigType extends PlayerConfig = PlayerConfig,
  GameConfigType extends
    GameConfig<PlayerConfigType> = GameConfig<PlayerConfigType>,
  GameStateType extends GameState<any> = GameState<any>,
> {
  abstract readonly configAdapter: GameConfigAdapter<
    PlayerConfigType,
    GameConfigType
  >;
  abstract readonly id: string;
  abstract readonly name: string;

  constructor() {}

  abstract initialState(config: GameConfigType): GameStateType;
}

export abstract class GameState<GameStateType extends GameState<any>> {
  constructor(
    readonly game: Game<PlayerConfig, GameConfig<PlayerConfig>, GameStateType>,
  ) {}
}
