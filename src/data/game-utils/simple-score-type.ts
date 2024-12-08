import { ScoreType, type Action, type GameState } from "../game/game";
import type { AccentColor } from "./accent-color";

export abstract class SimpleScoreType<
  GameStateType extends GameState,
> extends ScoreType {
  constructor(id: string) {
    super(id);
  }

  abstract getPlayerColor(playerIndex: number): AccentColor;

  abstract getScoreString(state: GameStateType, playerIndex: number): string;

  abstract canIncrementScore(
    state: GameStateType,
    playerIndex: number,
  ): boolean;

  abstract getIncrementAction(
    state: GameStateType,
    playerIndex: number,
  ): Action;
}
