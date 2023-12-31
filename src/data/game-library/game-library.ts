import type { Game } from "../game/game";
import { BasicGame } from "./basic/basic";
import { Tennis } from "./tennis/tennis";

const gamesArray = [new BasicGame(), new Tennis()];

export const gameLibrary = new Map<string, Game>(
  gamesArray.map((x) => [x.id, x]),
);
