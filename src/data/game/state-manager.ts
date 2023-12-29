import type { GameState } from "./game";

export type Listener<GameStateType extends GameState<any>> = (
  newState: GameStateType,
) => void;

export abstract class GameStateManager<GameStateType extends GameState<any>> {
  private _state: GameStateType;
  private readonly _listeners: Listener<GameStateType>[] = [];

  constructor(initialState: GameStateType) {
    this._state = initialState;
  }

  addEventListener(event: "stateupdate", listener: Listener<GameStateType>) {
    this._listeners.push(listener);
  }

  removeEventListener(event: "stateupdate", listener: Listener<GameStateType>) {
    const index = this._listeners.indexOf(listener);
    if (index >= 0) {
      this._listeners.splice(index, 1);
    }
  }

  protected getState(): GameStateType {
    if (this._state === null) {
      throw new Error("State not initialized");
    }
    return this._state;
  }

  protected updateState(newState: GameStateType) {
    this._state = newState;
    this._listeners.forEach((listener) => listener(newState));
  }
}

export class LocalGameStateManager<
  GameStateType extends GameState<any>,
> extends GameStateManager<GameStateType> {
  constructor(initialState: GameStateType) {
    super(initialState);
  }
}
