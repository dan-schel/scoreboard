import type { Action, GameState } from "./game";

export type AnnouncementSegment = {
  clip: string;
};

export type Announcement = AnnouncementSegment[];

export type EarbudAnnouncementListener = (announcement: Announcement) => void;

export abstract class EarbudInterface<GameStateType extends GameState> {
  // TODO: In future, each game should probably get to decide which actions are
  // available (and which earbud buttons they map to). E.g. faults are not
  // relevant for the basic game type.
  abstract getIncrementPlayer1Action(state: GameStateType): Action | null;
  abstract getIncrementPlayer2Action(state: GameStateType): Action | null;
  abstract getFaultAction(state: GameStateType): Action | null;

  abstract getStateUpdateAnnouncement(
    newState: GameStateType,
    oldState: GameStateType,
  ): Announcement | null;

  abstract getScoreSummaryAnnouncement(newState: GameStateType): Announcement;
}
