import { UndoStack } from "../game-utils/undo-stack";
import type {
  Action,
  GameBuilder,
  GameInstance,
  GameState,
  ScoreType,
} from "./game";
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
  abstract requestUndo(): void;
  abstract requestRedo(): void;

  abstract getPlayerCount(): number;
  abstract getScoreTypes(): ScoreType[];
  abstract do(action: Action): void;
}

export class LocalGameHandler<
  GameConfigType extends GameConfig,
  GameStateType extends GameState,
> extends GameHandler<GameStateType> {
  private _game: GameInstance<GameConfigType, GameStateType>;
  private _state: GameStateType;
  private readonly undoStack = new UndoStack<GameStateType>();

  constructor(
    builder: GameBuilder<GameConfigType, GameStateType>,
    config: GameConfigType,
  ) {
    super();
    this._game = builder.build(config);
    this._state = this._game.getInitialState();
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
    return this._game.getPlayerCount();
  }
  getScoreTypes(): ScoreType[] {
    return this._game.getScoreTypes();
  }
  do(action: Action): void {
    this._editState(this._state.do(action, this._game.config));
  }
}

// In future if desired:
// export class OnlineGameHandler<
//   GameStateType extends GameState,
// > extends GameHandler<GameStateType> {}
