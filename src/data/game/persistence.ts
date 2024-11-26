import { z } from "zod";
import type { GameBuilder, GameInstance, GameState } from "./game";
import { gameLibrary } from "../game-library/game-library";
import type { GameConfig } from "./config/config";

const matchesLSKey = "scoreboard-matches";
const maxMatchesToSave = 10;

const matchJsonSchema = z.object({
  game: z.string(),
  uuid: z.string(),
  config: z.unknown(),
  state: z.unknown(),
  datetime: z.coerce.date(),
});

const matchesJsonSchema = matchJsonSchema.array();

export type SuccessfullyLoadedGame<GameStateType extends GameState> = {
  uuid: string;
  game: GameBuilder<GameConfig, GameState>;
  instance: GameInstance<GameConfig, GameStateType>;
  state: GameStateType;
  error: false;
  datetime: Date;
};
export type CorruptedSaveGame = {
  uuid: string;
  game: GameBuilder<GameConfig, GameState> | null;
  error: true;
  datetime: Date;
};
export type LoadResults<GameStateType extends GameState> =
  | SuccessfullyLoadedGame<GameStateType>
  | CorruptedSaveGame;

export function findSavedMatch<GameStateType extends GameState>(
  game: GameBuilder<GameConfig, GameStateType>,
  uuid: string,
): LoadResults<GameStateType> | null {
  const allMatches = tryLoadMatches();

  const match = allMatches.find(
    (match) => match.game === game.id && match.uuid === uuid,
  );

  if (match == null) {
    return null;
  } else {
    return parseGame(match, game);
  }
}

export function fetchAllSavedMatches(): LoadResults<GameState>[] {
  const allMatches = tryLoadMatches();
  return allMatches.map((match) => {
    const game = gameLibrary.get(match.game);
    if (game == null) {
      return {
        uuid: match.uuid,
        game: null,
        error: true,
        datetime: match.datetime,
      };
    } else {
      return parseGame(match, game);
    }
  });
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

function tryLoadMatches(): z.infer<typeof matchesJsonSchema> {
  const matchesJson = localStorage.getItem(matchesLSKey);
  if (matchesJson === null) {
    return [];
  }

  try {
    const matches = matchesJsonSchema.parse(JSON.parse(matchesJson));
    matches.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
    return matches;
  } catch (e) {
    console.warn("Failed to load saved matches.", e);
    return [];
  }
}

function parseGame<GameStateType extends GameState>(
  match: z.infer<typeof matchJsonSchema>,
  game: GameBuilder<GameConfig, GameStateType>,
): LoadResults<GameStateType> {
  try {
    const config = game.deserializeConfig(match.config);
    const loadedGame = game.build(config, match.uuid);
    return {
      uuid: match.uuid,
      game: game,
      instance: loadedGame,
      state: loadedGame.deserializeState(match.state),
      error: false,
      datetime: match.datetime,
    };
  } catch (e) {
    return {
      uuid: match.uuid,
      game: game,
      error: true,
      datetime: match.datetime,
    };
  }
}

function saveMatches(matches: z.infer<typeof matchesJsonSchema>) {
  // Only save the most recent 10.
  matches.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
  matches.splice(maxMatchesToSave);
  localStorage.setItem(matchesLSKey, JSON.stringify(matches));
}

export function deleteMatch(uuid: string) {
  saveMatches(tryLoadMatches().filter((match) => match.uuid !== uuid));
}
