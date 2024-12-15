import {
  AnnouncementAudioSprite,
  EarbudInterface,
  type Announcement,
} from "@/data/game/earbud-interface";
import type { TennisState } from "./tennis-state";
import type { Action } from "@/data/game/game";
import { FaultAction, IncrementAction } from "./tennis-actions";
import {
  getClipForAccentColor,
  getClipForSetNumber,
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
import { TennisScore } from "./tennis-score";

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

    const serverColor =
      state.playerServing === "1"
        ? state.config.player1Color
        : state.config.player2Color;

    const serveSide = TennisScore.determineServeSide(
      state.player1Score,
      state.player2Score,
    );

    const servingClip = {
      left: "serving-left" as const,
      right: "serving-right" as const,
    }[serveSide];

    return [
      ...getPointsAnnouncement(state),
      getClipForAccentColor(serverColor),
      servingClip,
    ];
  }

  getActionAnnouncement(
    action: Action,
    newState: TennisState,
    oldState: TennisState,
  ): Announcement<TennisAnnouncementClip> | null {
    if (action.id === FaultAction.id) {
      return this.getFaultActionAnnouncement(newState);
    } else if (action.id === IncrementAction.id) {
      return this.getIncrementActionAnnouncement(action, newState, oldState);
    }
    return null;
  }

  private getFaultActionAnnouncement(
    newState: TennisState,
  ): Announcement<TennisAnnouncementClip> | null {
    if (newState.fault) {
      return ["fault"];
    } else {
      return ["fault-double", ...getScoreAnnouncement(newState)];
    }
  }

  private getIncrementActionAnnouncement(
    action: Action,
    newState: TennisState,
    oldState: TennisState,
  ): Announcement<TennisAnnouncementClip> | null {
    const { playerIndex } = IncrementAction.parse(action.data);

    const gameOver = newState.isGameOver();
    if (typeof gameOver === "object") {
      return [getClipForAccentColor(gameOver.winner), "wins"];
    } else if (gameOver !== false) {
      // TODO: Need a "someone" to put before this "wins".
      return ["wins"];
    }

    const { winsGame, winsSet } = TennisScore.awardPoint(
      oldState.config,
      playerIndex === 0 ? oldState.player1Score : oldState.player2Score,
      playerIndex === 0 ? oldState.player2Score : oldState.player1Score,
    );

    const scorerColor =
      playerIndex === 0
        ? oldState.config.player1Color
        : oldState.config.player2Color;

    if (winsSet) {
      const winNumber = getClipForSetNumber(
        newState.player1Score.setHistory.length,
      );
      return [getClipForAccentColor(scorerColor), winNumber];
    } else if (winsGame) {
      const causesTiebreak = newState.player1Score.tiebreakPoints != null;

      if (causesTiebreak) {
        return [
          "game",
          getClipForAccentColor(scorerColor, { end: true }),
          "tiebreak",
        ];
      } else {
        // TODO: Announce number of games each player has won. Need a clip for
        // when they're tied.
        return ["game", getClipForAccentColor(scorerColor, { end: true })];
      }
    } else {
      return getScoreAnnouncement(newState);
    }
  }
}
