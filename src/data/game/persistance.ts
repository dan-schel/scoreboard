import { z } from "zod";
import type { GameBuilder, GameInstance, GameState } from "./game";
import type { GameConfig } from "./game-config";

const matchesLSKey = "scoreboard-matches";
const maxMatchesToSave = 10;

const matchJson = z
  .object({
    game: z.string(),
    uuid: z.string(),
    config: z.unknown(),
    state: z.unknown(),
    datetime: z.coerce.date(),
  })
  .array();

export type LoadedGame<GameStateType extends GameState> = {
  game: GameInstance<GameConfig, GameStateType>;
  state: GameStateType;
};

export function findSavedMatch<GameStateType extends GameState>(
  game: GameBuilder<GameConfig, GameStateType>,
  uuid: string,
): LoadedGame<GameStateType> | null {
  const allMatches = tryLoadMatches();

  const match = allMatches.find(
    (match) => match.game === game.id && match.uuid === uuid,
  );

  if (match == null) {
    return null;
  }

  try {
    const config = game.deserializeConfig(match.config);
    const loadedGame = game.build(config, uuid);
    return {
      game: loadedGame,
      state: loadedGame.deserializeState(match.state),
    };
  } catch (e) {
    console.warn("Found match, but failed to deserialize config/state.", e);
    return null;
  }
}

export function saveMatch<GameStateType extends GameState>(
  gameInstance: GameInstance<GameConfig, GameStateType>,
  state: GameStateType,
) {
  const serialized = {
    game: gameInstance.game.id,
    uuid: gameInstance.uuid,
    config: gameInstance.game.serializeConfig(gameInstance.config),
    state: gameInstance.serializeState(state),
    datetime: new Date(Date.now()),
  };

  const allMatches = tryLoadMatches();

  const existingMatchIndex = allMatches.findIndex(
    (match) => match.game === serialized.game && match.uuid === serialized.uuid,
  );

  // Remove the old save for this match (if there is one) and add the new save
  // to the front of the array. Technically it doesn't matter where we add the
  // new save because saveMatches() will sort the array by datetime anyway!
  if (existingMatchIndex !== -1) {
    allMatches.splice(existingMatchIndex, 1);
  }
  allMatches.unshift(serialized);

  saveMatches(allMatches);
}

function tryLoadMatches(): z.infer<typeof matchJson> {
  const matchesJson = localStorage.getItem(matchesLSKey);
  if (matchesJson === null) {
    return [];
  }

  try {
    const matches = matchJson.parse(JSON.parse(matchesJson));
    matches.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
    return matches;
  } catch (e) {
    console.warn("Failed to load saved matches.", e);
    return [];
  }
}

function saveMatches(matches: z.infer<typeof matchJson>) {
  // Only save the most recent 10.
  matches.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
  matches.splice(maxMatchesToSave);
  localStorage.setItem(matchesLSKey, JSON.stringify(matches));
}
