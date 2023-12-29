import type { GameState } from "./game";

export type StateUpdateType = "new" | "undo" | "redo";

export type StateUpdateListener<GameStateType extends GameState<any>> = (
  newState: GameStateType,
  updateType: StateUpdateType,
) => void;
export type UndoRedoAvailabilityListener = (
  canUndo: boolean,
  canRedo: boolean,
) => void;

export abstract class GameStateManager<GameStateType extends GameState<any>> {
  private _state: GameStateType;
  private _stateUpdateListeners: StateUpdateListener<GameStateType>[] = [];
  private _undoRedoAvailabilityListeners: UndoRedoAvailabilityListener[] = [];

  constructor(initialState: GameStateType) {
    this._state = initialState;
  }

  protected getState(): GameStateType {
    return this._state;
  }
  abstract canUndo(): boolean;
  abstract canRedo(): boolean;
  abstract requestUndo(): void;
  abstract requestRedo(): void;

  protected updateState(newState: GameStateType, updateType: StateUpdateType) {
    this._state = newState;
    this._stateUpdateListeners.forEach((x) => x(newState, updateType));
  }
  protected updateUndoRedoAvailability(
    canUndo: boolean,
    canRedo: boolean,
  ): void {
    this._undoRedoAvailabilityListeners.forEach((x) => x(canUndo, canRedo));
  }
  addStateUpdateListener(handler: StateUpdateListener<GameStateType>): void {
    this._stateUpdateListeners.push(handler);
  }
  removeStateUpdateListener(handler: StateUpdateListener<GameStateType>): void {
    this._stateUpdateListeners = this._stateUpdateListeners.filter(
      (x) => x != handler,
    );
  }
  addUndoRedoAvailabilityListener(handler: UndoRedoAvailabilityListener): void {
    this._undoRedoAvailabilityListeners.push(handler);
  }
  removeUndoRedoAvailabilityListener(
    handler: UndoRedoAvailabilityListener,
  ): void {
    this._undoRedoAvailabilityListeners =
      this._undoRedoAvailabilityListeners.filter((x) => x != handler);
  }
}

export class LocalGameStateManager<
  GameStateType extends GameState<any>,
> extends GameStateManager<GameStateType> {
  private _undoStack: GameStateType[] = [];
  private _redoStack: GameStateType[] = [];

  constructor(initialState: GameStateType) {
    super(initialState);
  }

  private _pushNewState(newState: GameStateType): void {
    this._undoStack.push(this.getState());
    this._redoStack = [];
    this.updateState(newState, "new");
    this.updateUndoRedoAvailability(this.canUndo(), this.canRedo());
  }

  canUndo(): boolean {
    return this._undoStack.length > 0;
  }
  canRedo(): boolean {
    return this._redoStack.length > 0;
  }
  requestUndo(): void {
    if (this.canUndo()) {
      this._redoStack.push(this.getState());
      this.updateState(this._undoStack.pop()!, "undo");
      this.updateUndoRedoAvailability(this.canUndo(), this.canRedo());
    }
  }
  requestRedo(): void {
    if (this.canRedo()) {
      this._undoStack.push(this.getState());
      this.updateState(this._redoStack.pop()!, "redo");
      this.updateUndoRedoAvailability(this.canUndo(), this.canRedo());
    }
  }
}
