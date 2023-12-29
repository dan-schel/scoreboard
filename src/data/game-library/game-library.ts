import type { Game } from "../game/game";
import { BasicGame } from "./basic/basic";
import { Tennis } from "./tennis/tennis";

export const gameLibrary = new Map<string, Game>([
  ["basic", new BasicGame()],
  ["tennis", new Tennis()],
]);
