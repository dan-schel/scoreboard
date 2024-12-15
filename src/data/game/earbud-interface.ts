import type { Action, GameState } from "./game";

export type Announcement<AvailableClipType extends string> =
  AvailableClipType[];

export type AnnouncementAudioSpriteClip = {
  offset: number;
  duration: number;
  text: string;
};

export class AnnouncementAudioSprite {
  constructor(
    readonly file: string,
    readonly clips: Map<string, AnnouncementAudioSpriteClip>,
  ) {}

  toHowlerSpriteDefinition() {
    const sprite: Record<string, [number, number]> = {};
    for (const [clip, { offset, duration }] of this.clips) {
      sprite[clip] = [offset, duration];
    }
    return sprite;
  }
}

export type AnnouncementListener<AvailableClipType extends string> = (
  announcement: Announcement<AvailableClipType>,
) => void;

export abstract class EarbudInterface<
  GameStateType extends GameState,
  AvailableClipType extends string,
> {
  private readonly _announcementListeners: AnnouncementListener<AvailableClipType>[];

  constructor() {
    this._announcementListeners = [];
  }

  addAnnouncementListener(listener: AnnouncementListener<AvailableClipType>) {
    this._announcementListeners.push(listener);
  }
  removeAnnouncementListener(
    listener: AnnouncementListener<AvailableClipType>,
  ) {
    const index = this._announcementListeners.indexOf(listener);
    if (index !== -1) {
      this._announcementListeners.splice(index, 1);
    }
  }

  onAction(action: Action, newState: GameStateType, oldState: GameStateType) {
    const announcement = this.getActionAnnouncement(action, newState, oldState);
    if (announcement) {
      this._announcementListeners.forEach((l) => l(announcement));
    }
  }

  // TODO: In future, each game should probably get to decide which actions are
  // available (and which earbud buttons they map to). E.g. faults are not
  // relevant for the basic game type.
  abstract getIncrementPlayer1Action(state: GameStateType): Action | null;
  abstract getIncrementPlayer2Action(state: GameStateType): Action | null;
  abstract getFaultAction(state: GameStateType): Action | null;

  abstract getAudioSprite(): AnnouncementAudioSprite;

  abstract getActivationAnnouncement(
    state: GameStateType,
  ): Announcement<AvailableClipType> | null;

  abstract getUndoAnnouncement(): Announcement<AvailableClipType> | null;

  abstract getScoreSummaryAnnouncement(
    state: GameStateType,
  ): Announcement<AvailableClipType>;

  abstract getActionAnnouncement(
    action: Action,
    newState: GameStateType,
    oldState: GameStateType,
  ): Announcement<AvailableClipType> | null;
}
