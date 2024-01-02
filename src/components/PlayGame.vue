<script setup lang="ts" generic="GameStateType extends GameState">
import { type GameState } from "@/data/game/game";
import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { type GameHandler } from "@/data/game/game-handler";
import ScoreDisplay from "./score-display/ScoreDisplay.vue";

const props = defineProps<{
  handler: GameHandler<GameStateType>;
}>();

const gameState = ref(props.handler.getState()) as Ref<GameStateType>;
const canUndo = ref(props.handler.canUndo());
const canRedo = ref(props.handler.canRedo());

function handleStateUpdate() {
  gameState.value = props.handler.getState();
  canUndo.value = props.handler.canUndo();
  canRedo.value = props.handler.canRedo();
}

watch(
  () => props.handler,
  (newValue, oldValue) => {
    if (oldValue != null) {
      oldValue.removeChangeListener(handleStateUpdate);
    }
    newValue.addChangeListener(handleStateUpdate);
    handleStateUpdate();
  },
);

onMounted(() => {
  props.handler.addChangeListener(handleStateUpdate);
});
onUnmounted(() => {
  props.handler.removeChangeListener(handleStateUpdate);
});
</script>

<template>
  <p>Play game</p>
  <button @click="handler.requestUndo()" :disabled="!canUndo">Undo</button>
  <button @click="handler.requestRedo()" :disabled="!canRedo">Redo</button>
  <div>
    <div v-for="i in handler.getPlayerCount()" :key="i">
      <ScoreDisplay
        v-for="scoreType in handler.getScoreTypes()"
        :key="scoreType.id"
        :score="scoreType"
        :state="gameState"
        :playerIndex="i - 1"
        @submit-action="(action) => handler.do(action)"
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
