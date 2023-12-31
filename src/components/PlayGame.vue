<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import { GameBuilder, type GameState } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { LocalGameHandler, type GameHandler } from "@/data/game/game-handler";
import ScoreDisplay from "./score-display/ScoreDisplay.vue";

const props = defineProps<{
  game: GameBuilder<GameConfigType, GameStateType>;
  config: GameConfigType;
}>();

const gameHandler = ref<GameHandler<GameStateType>>(
  new LocalGameHandler(props.game, props.config),
) as Ref<GameHandler<GameStateType>>;

const gameState = ref(gameHandler.value.getState()) as Ref<GameStateType>;
const canUndo = ref(gameHandler.value.canUndo());
const canRedo = ref(gameHandler.value.canRedo());

function handleStateUpdate() {
  gameState.value = gameHandler.value.getState();
  canUndo.value = gameHandler.value.canUndo();
  canRedo.value = gameHandler.value.canRedo();
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
  <div>
    <div v-for="i in gameHandler.getPlayerCount()" :key="i">
      <ScoreDisplay
        v-for="scoreType in gameHandler.getScoreTypes()"
        :key="scoreType.id"
        :score="scoreType"
        :state="gameState"
        :playerIndex="i - 1"
        @submit-action="(action) => gameHandler.do(action)"
      >
      </ScoreDisplay>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

button {
  @include template.button-classic;
}
</style>
