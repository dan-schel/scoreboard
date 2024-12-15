import type { AccentColor } from "@/data/game-utils/accent-color";

export const TennisAnnouncementsClips = [
  "number-nil",
  "number-nil-end",
  "number-0",
  "number-0-end",
  "number-1",
  "number-1-end",
  "number-2",
  "number-2-end",
  "number-3",
  "number-3-end",
  "number-4",
  "number-4-end",
  "number-5",
  "number-5-end",
  "number-6",
  "number-6-end",
  "number-7",
  "number-7-end",
  "number-8",
  "number-8-end",
  "number-9",
  "number-9-end",
  "number-10",
  "number-10-end",
  "number-11",
  "number-11-end",
  "number-12",
  "number-12-end",
  "number-13",
  "number-13-end",
  "number-14",
  "number-14-end",
  "number-15",
  "number-15-end",
  "number-16",
  "number-16-end",
  "number-17",
  "number-17-end",
  "number-18",
  "number-18-end",
  "number-19",
  "number-19-end",
  "number-20",
  "number-20-end",
  "number-30",
  "number-30-end",
  "number-40",
  "number-40-end",
  "number-unknown",
  "number-unknown-end",
  "all",
  "advantage",
  "orange-end",
  "green-end",
  "blue-end",
  "purple-end",
  "game",
  "wins",
  "orange",
  "green",
  "blue",
  "purple",
  "takes-set-1",
  "takes-set-2",
  "takes-set-3",
  "takes-set-4",
  "takes-set-5",
  "takes-set-unknown",
  "leads",
  "games-to",
  "game-to",
  "match-point",
  "set-point",
  "break-point",
  "tiebreak",
  "serving-left",
  "serving-right",
  "serving",
  "undo",
  "fault",
  "fault-double",
  "earbud-mode-activated",
] as const;

export type TennisAnnouncementClip = (typeof TennisAnnouncementsClips)[number];

export function getClipForNumber(
  input: number,
  { end = false } = {},
): TennisAnnouncementClip {
  switch (input) {
    case 0:
      return end ? "number-nil-end" : "number-nil"; // Or could use 'number-0'.
    case 1:
      return end ? "number-1-end" : "number-1";
    case 2:
      return end ? "number-2-end" : "number-2";
    case 3:
      return end ? "number-3-end" : "number-3";
    case 4:
      return end ? "number-4-end" : "number-4";
    case 5:
      return end ? "number-5-end" : "number-5";
    case 6:
      return end ? "number-6-end" : "number-6";
    case 7:
      return end ? "number-7-end" : "number-7";
    case 8:
      return end ? "number-8-end" : "number-8";
    case 9:
      return end ? "number-9-end" : "number-9";
    case 10:
      return end ? "number-10-end" : "number-10";
    case 11:
      return end ? "number-11-end" : "number-11";
    case 12:
      return end ? "number-12-end" : "number-12";
    case 13:
      return end ? "number-13-end" : "number-13";
    case 14:
      return end ? "number-14-end" : "number-14";
    case 15:
      return end ? "number-15-end" : "number-15";
    case 16:
      return end ? "number-16-end" : "number-16";
    case 17:
      return end ? "number-17-end" : "number-17";
    case 18:
      return end ? "number-18-end" : "number-18";
    case 19:
      return end ? "number-19-end" : "number-19";
    case 20:
      return end ? "number-20-end" : "number-20";
    case 30:
      return end ? "number-30-end" : "number-30";
    case 40:
      return end ? "number-40-end" : "number-40";
    default:
      return end ? "number-unknown-end" : "number-unknown";
  }
}

export function getClipForAccentColor(
  accentColor: AccentColor,
  { end = false } = {},
): TennisAnnouncementClip {
  switch (accentColor) {
    case "orange":
      return end ? "orange-end" : "orange";
    case "green":
      return end ? "green-end" : "green";
    case "blue":
      return end ? "blue-end" : "blue";
    case "purple":
      return end ? "purple-end" : "purple";
  }
}
