<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import type { GameBuilder, GameState } from "@/data/game/game";
import { GameConfig } from "@/data/game/game-config";
import ConfigureGame from "./ConfigureGame.vue";
import { ref, watch, type Ref, onUnmounted } from "vue";
import PlayGame from "./PlayGame.vue";
import { LocalGameHandler, type GameHandler } from "@/data/game/game-handler";
import { findSavedMatch, saveMatch } from "@/data/game/persistence";

// Save the game after 200ms of inactivity.
const saveTime = 200;

const props = defineProps<{
  game: GameBuilder<GameConfigType, GameStateType>;
  uuid: string;
}>();

const handler = ref<GameHandler<GameStateType> | null>(
  null,
) as Ref<GameHandler<GameStateType> | null>;

watch(handler, (newValue, oldValue) => {
  if (oldValue != null) {
    oldValue.removeChangeListener(handleStateUpdate);
  }
  if (newValue != null) {
    newValue.addChangeListener(handleStateUpdate);
    handleStateUpdate();
  }
});

watch(
  [() => props.game, () => props.uuid],
  () => {
    handler.value = null;
    const saved = findSavedMatch(props.game, props.uuid);
    if (saved == null) {
      console.log("No saved game found.");
    } else if (saved.error) {
      console.warn("Error loading saved game.");
    } else {
      handler.value = new LocalGameHandler(saved.instance, saved.state);
      console.log("Loaded saved game.");
    }
  },
  { immediate: true },
);

const saveTimer = ref<number | null>(null);

function handleGameConfigured(config: GameConfigType) {
  console.log("Starting new game.", config);
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
  <h1>{{ game.name }}</h1>
  <ConfigureGame
    v-if="handler == null"
    :game="game"
    @submit="handleGameConfigured"
  ></ConfigureGame>
  <PlayGame v-else :handler="handler"></PlayGame>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
