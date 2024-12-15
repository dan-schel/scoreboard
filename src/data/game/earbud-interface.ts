import type { Action, GameState } from "./game";

export type AnnouncementSegment = {
  clip: string;
};

export type Announcement = AnnouncementSegment[];

export type EarbudAnnouncementListener = (announcement: Announcement) => void;

export class AnnouncementAudioSprite {
  constructor(
    readonly file: string,
    readonly clips: Map<string, { offset: number; duration: number }>,
  ) {}

  toHowlerSpriteDefinition() {
    const sprite: Record<string, [number, number]> = {};
    for (const [clip, { offset, duration }] of this.clips) {
      sprite[clip] = [offset, duration];
    }
    return sprite;
  }
}

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

  abstract getScoreSummaryAnnouncement(state: GameStateType): Announcement;

  abstract getActivationAnnoucement(state: GameStateType): Announcement | null;

  abstract getAudioSprite(): AnnouncementAudioSprite;
}

export function annoucement<AvailableAnnoucement extends string>(
  input: AvailableAnnoucement[],
): Announcement {
  return input.map((clip) => ({ clip }));
}
