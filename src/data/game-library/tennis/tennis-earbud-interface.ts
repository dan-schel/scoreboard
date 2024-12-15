import {
  AnnouncementAudioSprite,
  EarbudInterface,
  type Announcement,
} from "@/data/game/earbud-interface";
import type { TennisState } from "./tennis-state";
import type { Action } from "@/data/game/game";
import { FaultAction, IncrementAction } from "./tennis-actions";
import {
  TennisAnnoucementsClips,
  type TennisAnnoucementClip,
} from "./announcements/clip-ids";
import {
  tennisAnnoucementClipDurations,
  tennisAnnoucementClipOffsets,
} from "./announcements/clip-timings";
import { tennisAnnoucementClipText } from "./announcements/clip-text";
import { getScoreAnnoucement } from "./announcements/score";

export class TennisEarbudInterface extends EarbudInterface<
  TennisState,
  TennisAnnoucementClip
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
        TennisAnnoucementsClips.map((x) => [
          x,
          {
            offset: tennisAnnoucementClipOffsets[x],
            duration: tennisAnnoucementClipDurations[x],
            text: tennisAnnoucementClipText[x],
          },
        ]),
      ),
    );
  }

  getActivationAnnoucement(
    _state: TennisState,
  ): Announcement<TennisAnnoucementClip> | null {
    return ["earbud-mode-activated"];
  }

  getScoreSummaryAnnouncement(
    _state: TennisState,
  ): Announcement<TennisAnnoucementClip> {
    // TODO: Implement this.
    return [];
  }

  getStateUpdateAnnouncement(
    newState: TennisState,
    _oldState: TennisState,
  ): Announcement<TennisAnnoucementClip> | null {
    // TODO: Test only.
    return getScoreAnnoucement(newState);
  }
}
