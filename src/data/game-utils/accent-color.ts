export const AccentColors = ["orange", "green", "blue", "purple"] as const;

export type AccentColor = (typeof AccentColors)[number];

export const accentColorDisplayStrings: Record<AccentColor, string> = {
  orange: "Orange",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
};

export function getAccentColorDisplayString(color: AccentColor) {
  return accentColorDisplayStrings[color];
}
