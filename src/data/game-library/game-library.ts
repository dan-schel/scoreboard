import type { GameBuilder } from "../game/game";
import { BasicGameBuilder } from "./basic/basic";
import { TennisBuilder } from "./tennis/tennis";

const gamesArray = [new BasicGameBuilder(), new TennisBuilder()];

export const gameLibrary = new Map<string, GameBuilder>(
  gamesArray.map((x) => [x.id, x]),
);
