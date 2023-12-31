<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import { GameBuilder, type GameState } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { LocalGameHandler, type GameHandler } from "@/data/game/game-handler";

const props = defineProps<{
  game: GameBuilder<GameConfigType, GameStateType>;
  config: GameConfigType;
}>();

const gameHandler = ref<GameHandler<GameStateType>>(
  new LocalGameHandler(props.game, props.config),
) as Ref<GameHandler<GameStateType>>;

const gameState = ref(gameHandler.value.getState()) as Ref<GameStateType>;
const canUndo = ref(gameHandler.value.canUndo());
const canRedo = ref(gameHandler.value.canUndo());

function handleStateUpdate() {
  gameState.value = gameHandler.value.getState();
}

onMounted(() => {
  gameHandler.value.addChangeListener(handleStateUpdate);
});
onUnmounted(() => {
  gameHandler.value.removeChangeListener(handleStateUpdate);
});
</script>

<template>
  <p>Play game</p>
  <button @click="gameHandler.requestUndo()" :disabled="!canUndo">Undo</button>
  <button @click="gameHandler.requestRedo()" :disabled="!canRedo">Redo</button>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

button {
  @include template.button-classic;
}
</style>
