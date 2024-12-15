import {
  annoucement,
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
} from "./announcements/tennis-annoucements-clip-ids";
import {
  tennisAnnoucementClipDurations,
  tennisAnnoucementClipOffsets,
} from "./announcements/tennis-annoucements-clip-durations";

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
    _newState: TennisState,
    _oldState: TennisState,
  ): Announcement | null {
    // TODO: Test only.
    return annoucement<TennisAnnoucementClip>([
      "number-1",
      "number-0-end",
      "break-point",
    ]);
  }

  getScoreSummaryAnnouncement(_state: TennisState): Announcement {
    // TODO: Implement this.
    return annoucement<TennisAnnoucementClip>([]);
  }

  getActivationAnnoucement(_state: TennisState): Announcement | null {
    return annoucement<TennisAnnoucementClip>(["earbud-mode-activated"]);
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
          },
        ]),
      ),
    );
  }
}
