<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import type { GameBuilder, GameState } from "@/data/game/game";
import ConfigureGame from "./ConfigureGame.vue";
import { ref, watch, type Ref, onUnmounted, onMounted } from "vue";
import PlayGame from "./PlayGame.vue";
import { LocalGameHandler, type GameHandler } from "@/data/game/game-handler";
import { findSavedMatch, saveMatch } from "@/data/game/persistence";
import type { GameConfig } from "@/data/game/config/config";

// Save the game after 200ms of inactivity.
const saveTime = 200;

const props = defineProps<{
  game: GameBuilder<GameConfigType, GameStateType>;
  uuid: string;
  rematchOf?: string;
}>();

const handler = ref<GameHandler<GameStateType> | null>(
  null,
) as Ref<GameHandler<GameStateType> | null>;

const saveTimer = ref<number | null>(null);

watch(handler, (newValue, oldValue) => {
  if (oldValue != null) {
    oldValue.removeChangeListener(handleStateUpdate);
  }
  if (newValue != null) {
    newValue.addChangeListener(handleStateUpdate);
    handleStateUpdate();
  }
});

function initPage() {
  handler.value = null;
  const saved = findSavedMatch(props.game, props.uuid);
  if (saved == null) {
    if (props.rematchOf) {
      const save = findSavedMatch(props.game, props.rematchOf);
      if (save != null && !save.error && save.game.id === props.game.id) {
        // Cast is safe because we checked that the save is of the same game.
        console.log("Starting rematch:", save.instance.config);
        startGame(save.instance.config as GameConfigType);
      } else {
        console.warn("Failed to launch rematch.");
      }
    } else {
      console.log("No saved game found - configuring new game.");
    }
  } else if (saved.error) {
    console.warn("Error loading saved game.");
  } else {
    handler.value = new LocalGameHandler(saved.instance, saved.state);
    console.log("Loaded saved game.");
  }
}

function handleGameConfigured(config: GameConfigType) {
  console.log("Game configured:", config);
  startGame(config);
}

function startGame(config: GameConfigType) {
  const newGame = props.game.build(config, props.uuid);
  const state = newGame.getInitialState();
  handler.value = new LocalGameHandler(newGame, state);
}

function handleStateUpdate() {
  if (saveTimer.value != null) {
    clearTimeout(saveTimer.value);
  }
  saveTimer.value = setTimeout(() => {
    const handlerValue = handler.value;
    if (handlerValue != null && handlerValue instanceof LocalGameHandler) {
      saveMatch(handlerValue.game, handlerValue.getState());
      console.log("Saved game.");
    }
  }, saveTime) as unknown as number;
}

onMounted(() => {
  initPage();
});
onUnmounted(() => {
  if (saveTimer.value != null) {
    clearTimeout(saveTimer.value);
  }
  if (handler.value != null) {
    handler.value.removeChangeListener(handleStateUpdate);
  }
});
</script>

<template>
  <ConfigureGame
    v-if="handler == null"
    :game="game"
    @submit="handleGameConfigured"
  ></ConfigureGame>
  <PlayGame
    v-else
    :handler="handler"
    :game-id="game.id"
    :instance-uuid="uuid"
    :key="uuid"
  ></PlayGame>
</template>
