import type { Announcement } from "@/data/game/earbud-interface";
import {
  getClipForAccentColor,
  getClipForNumber,
  type TennisAnnouncementClip,
} from "./clip-ids";
import type { TennisState } from "../tennis-state";

export function getScoreAnnouncement(
  state: TennisState,
): Announcement<TennisAnnouncementClip> {
  const specialPointType = state.getSpecialPointType();

  if (specialPointType !== null) {
    // This maps special point types to the corresponding clip id. It looks a
    // bit dumb because right now they're identical lol.
    const specialPointAnnouncement: TennisAnnouncementClip = {
      "break-point": "break-point" as const,
      "set-point": "set-point" as const,
      "match-point": "match-point" as const,
    }[specialPointType];

    return [...getPointsAnnouncement(state), specialPointAnnouncement];
  } else {
    return getPointsAnnouncement(state);
  }
}

export function getPointsAnnouncement(
  state: TennisState,
): Announcement<TennisAnnouncementClip> {
  const firstScore =
    state.playerServing === "1" ? state.player1Score : state.player2Score;
  const secondScore =
    state.playerNotServing === "1" ? state.player1Score : state.player2Score;

  if (
    firstScore.tiebreakPoints !== null &&
    secondScore.tiebreakPoints !== null
  ) {
    const firstClip = getClipForNumber(firstScore.tiebreakPoints);
    if (secondScore.tiebreakPoints === firstScore.tiebreakPoints) {
      return [firstClip, "all"];
    } else {
      const secondClip = getClipForNumber(secondScore.tiebreakPoints, {
        end: true,
      });
      return [firstClip, secondClip];
    }
  } else if (firstScore.points === "40" && secondScore.points === "40") {
    // TODO: Handle deuce. I forgot to record a clip for it :(
    return ["number-40", "all"];
  } else if (
    firstScore.points !== "advantage" &&
    secondScore.points !== "advantage"
  ) {
    const firstClip = getClipForPoints(firstScore.points);
    if (secondScore.points === firstScore.points) {
      return [firstClip, "all"];
    } else {
      const secondClip = getClipForPoints(secondScore.points, { end: true });
      return [firstClip, secondClip];
    }
  } else if (state.player1Score.points === "advantage") {
    return [
      "advantage",
      getClipForAccentColor(state.config.player1Color, { end: true }),
    ];
  } else if (state.player2Score.points === "advantage") {
    return [
      "advantage",
      getClipForAccentColor(state.config.player2Color, { end: true }),
    ];
  } else {
    return [];
  }
}

function getClipForPoints(
  input: "0" | "15" | "30" | "40",
  { end = false } = {},
): TennisAnnouncementClip {
  switch (input) {
    case "0":
      return getClipForNumber(0, { end });
    case "15":
      return getClipForNumber(15, { end });
    case "30":
      return getClipForNumber(30, { end });
    case "40":
      return getClipForNumber(40, { end });
  }
}
