export class UndoStack<T> {
  private _undoStack: T[] = [];
  private _redoStack: T[] = [];

  constructor(readonly undoLimit: number = 50) {}

  push(newValue: T): void {
    this._undoStack.push(newValue);
    if (this._undoStack.length > this.undoLimit) {
      this._undoStack.shift();
    }
    this._redoStack = [];
  }

  canUndo(): boolean {
    return this._undoStack.length > 0;
  }
  canRedo(): boolean {
    return this._redoStack.length > 0;
  }

  undo(currentState: T): T | null {
    const newState = this._undoStack.pop();
    if (newState == null) {
      return null;
    }
    this._redoStack.push(currentState);
    return newState;
  }

  redo(currentState: T): T | null {
    const newState = this._redoStack.pop();
    if (newState == null) {
      return null;
    }
    this._undoStack.push(currentState);
    return newState;
  }
}
