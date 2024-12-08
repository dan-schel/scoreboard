import {
  EarbudInterface,
  type Announcement,
} from "@/data/game/earbud-interface";
import type { TennisState } from "./tennis-state";
import type { Action } from "@/data/game/game";
import { FaultAction, IncrementAction } from "./tennis-actions";

export class TennisEarbudInterface extends EarbudInterface<TennisState> {
  getIncrementPlayer1Action(_state: TennisState): Action | null {
    return IncrementAction.create(0);
  }

  getIncrementPlayer2Action(_state: TennisState): Action | null {
    return IncrementAction.create(1);
  }

  getFaultAction(_state: TennisState): Action | null {
    return FaultAction.create();
  }

  getStateUpdateAnnouncement(
    oldState: TennisState,
    newState: TennisState,
  ): Announcement | null {
    return null;
  }

  getScoreSummaryAnnouncement(newState: TennisState): Announcement {
    return [];
  }
}
