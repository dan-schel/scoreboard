import type { Action, GameState } from "./game";

export type AnnouncementSegment = {
  clip: string;
};

export type Announcement = AnnouncementSegment[];

export type EarbudAnnouncementListener = (announcement: Announcement) => void;

export abstract class EarbudInterface<GameStateType extends GameState> {
  private readonly _announcementListeners: EarbudAnnouncementListener[];

  constructor() {
    this._announcementListeners = [];
  }

  addAnnouncementListener(listener: EarbudAnnouncementListener) {
    this._announcementListeners.push(listener);
  }

  removeAnnouncementListener(listener: EarbudAnnouncementListener) {
    const index = this._announcementListeners.indexOf(listener);
    if (index !== -1) {
      this._announcementListeners.splice(index, 1);
    }
  }

  // TODO: In future, each game should probably get to decide which actions are
  // available (and which earbud buttons they map to). E.g. faults are not
  // relevant for the basic game type.
  abstract getIncrementPlayer1Action(state: GameStateType): Action | null;
  abstract getIncrementPlayer2Action(state: GameStateType): Action | null;
  abstract getFaultAction(state: GameStateType): Action | null;

  abstract getStateUpdateAnnouncement(
    oldState: GameStateType,
    newState: GameStateType,
  ): Announcement | null;

  abstract getScoreSummaryAnnouncement(newState: GameStateType): Announcement;
}
