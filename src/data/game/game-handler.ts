import { UndoStack } from "../game-utils/undo-stack";
import type { Action, GameInstance, GameState, ScoreType } from "./game";
import type { GameConfig } from "./game-config";

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

  // TODO: For online game handlers, this would need to be async.
  abstract do(action: Action): void;
}

export class LocalGameHandler<
  GameConfigType extends GameConfig,
  GameStateType extends GameState,
> extends GameHandler<GameStateType> {
  private _state: GameStateType;
  private readonly undoStack = new UndoStack<GameStateType>();

  constructor(
    readonly game: GameInstance<GameConfigType, GameStateType>,
    state: GameStateType,
  ) {
    super();
    this._state = state;
  }

  private _editState(newState: GameStateType): void {
    this.undoStack.push(this._state);
    this._state = newState;
    this.notifyChange();
  }
  getState(): GameStateType {
    return this._state;
  }
  canUndo(): boolean {
    return this.undoStack.canUndo();
  }
  canRedo(): boolean {
    return this.undoStack.canRedo();
  }
  requestUndo(): void {
    const prevState = this.undoStack.undo(this._state);
    if (prevState != null) {
      this._state = prevState;
      this.notifyChange();
    }
  }
  requestRedo(): void {
    const prevState = this.undoStack.redo(this._state);
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
  do(action: Action): void {
    this._editState(this._state.do(action));
  }
}

// In future if desired:
// export class OnlineGameHandler<
//   GameStateType extends GameState,
// > extends GameHandler<GameStateType> {}
