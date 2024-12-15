import { UndoStack } from "../game-utils/undo-stack";
import type { GameConfig } from "./config/config";
import type { EarbudInterface } from "./earbud-interface";
import type { Action, GameInstance, GameState, ScoreType } from "./game";

export abstract class GameHandler<GameStateType extends GameState> {
  private _changeListeners: (() => void)[] = [];
  addChangeListener(listener: () => void): void {
    this._changeListeners.push(listener);
  }
  removeChangeListener(listener: () => void): void {
    this._changeListeners = this._changeListeners.filter((l) => l !== listener);
  }
  protected notifyChange(): void {
    this._changeListeners.forEach((l) => l());
  }

  abstract getState(): GameStateType;
  abstract canUndo(): boolean;
  abstract canRedo(): boolean;

  // TODO: For online game handlers, this would need to be async.
  abstract requestUndo(): void;

  // TODO: For online game handlers, this would need to be async.
  abstract requestRedo(): void;

  abstract getPlayerCount(): number;
  abstract getScoreType(): ScoreType;
  abstract getEarbudInterface(): EarbudInterface<GameStateType, string> | null;

  // TODO: For online game handlers, this would need to be async.
  abstract do(action: Action): void;
}

export class LocalGameHandler<
  GameConfigType extends GameConfig,
  GameStateType extends GameState,
> extends GameHandler<GameStateType> {
  private _state: GameStateType;
  private readonly _undoStack;
  private _earbudInterface: EarbudInterface<GameStateType, string> | null;

  constructor(
    readonly game: GameInstance<GameConfigType, GameStateType>,
    state: GameStateType,
  ) {
    super();
    this._state = state;
    this._undoStack = new UndoStack<GameStateType>();
    this._earbudInterface = this.game.getEarbudInterface();
  }

  private _editState(newState: GameStateType): void {
    this._undoStack.push(this._state);
    this._state = newState;
    this.notifyChange();
  }
  getState(): GameStateType {
    return this._state;
  }
  canUndo(): boolean {
    return this._undoStack.canUndo();
  }
  canRedo(): boolean {
    return this._undoStack.canRedo();
  }
  requestUndo(): void {
    const prevState = this._undoStack.undo(this._state);
    if (prevState != null) {
      this._state = prevState;
      this.notifyChange();
    }
  }
  requestRedo(): void {
    const prevState = this._undoStack.redo(this._state);
    if (prevState != null) {
      this._state = prevState;
      this.notifyChange();
    }
  }

  getPlayerCount(): number {
    return this.game.getPlayerCount();
  }
  getScoreType(): ScoreType {
    return this.game.getScoreType();
  }
  getEarbudInterface(): EarbudInterface<GameStateType, string> | null {
    return this._earbudInterface;
  }
  do(action: Action): void {
    const oldState = this._state;
    const newState = oldState.do(action);
    this._editState(newState);
    this._earbudInterface?.onAction(action, newState, oldState);
  }
}

// In future if desired:
// export class OnlineGameHandler<
//   GameStateType extends GameState,
// > extends GameHandler<GameStateType> {}
