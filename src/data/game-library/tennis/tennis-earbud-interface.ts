import {
  AnnouncementAudioSprite,
  EarbudInterface,
  type Announcement,
} from "@/data/game/earbud-interface";
import type { TennisState } from "./tennis-state";
import type { Action } from "@/data/game/game";
import { FaultAction, IncrementAction } from "./tennis-actions";
import {
  TennisAnnouncementsClips,
  type TennisAnnouncementClip,
} from "./announcements/clip-ids";
import {
  tennisAnnouncementClipDurations,
  tennisAnnouncementClipOffsets,
} from "./announcements/clip-timings";
import { tennisAnnouncementClipText } from "./announcements/clip-text";
import {
  getPointsAnnouncement,
  getScoreAnnouncement,
} from "./announcements/score";

export class TennisEarbudInterface extends EarbudInterface<
  TennisState,
  TennisAnnouncementClip
> {
  getIncrementPlayer1Action(_state: TennisState): Action | null {
    return IncrementAction.create(0);
  }

  getIncrementPlayer2Action(_state: TennisState): Action | null {
    return IncrementAction.create(1);
  }

  getFaultAction(_state: TennisState): Action | null {
    return FaultAction.create();
  }

  getAudioSprite(): AnnouncementAudioSprite {
    return new AnnouncementAudioSprite(
      "/tennis-announcements.mp3",
      new Map(
        TennisAnnouncementsClips.map((x) => [
          x,
          {
            offset: tennisAnnouncementClipOffsets[x],
            duration: tennisAnnouncementClipDurations[x],
            text: tennisAnnouncementClipText[x],
          },
        ]),
      ),
    );
  }

  getActivationAnnouncement(
    _state: TennisState,
  ): Announcement<TennisAnnouncementClip> | null {
    return ["earbud-mode-activated"];
  }

  getUndoAnnouncement(): Announcement<TennisAnnouncementClip> | null {
    return ["undo"];
  }

  getScoreSummaryAnnouncement(
    state: TennisState,
  ): Announcement<TennisAnnouncementClip> {
    // Purposely using getPointsAnnouncement instead of getScoreAnnouncement,
    // because I think there's little value in repeating "Break point" etc. when
    // a player manually asks for the scores to be repeated.
    return getPointsAnnouncement(state);
  }

  getStateUpdateAnnouncement(
    newState: TennisState,
    _oldState: TennisState,
  ): Announcement<TennisAnnouncementClip> | null {
    // TODO: Test only.
    return getScoreAnnouncement(newState);
  }
}
