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
  <div class="play">
    <!-- <button @click="handler.requestUndo()" :disabled="!canUndo">
      <p>Undo</p>
    </button>
    <button @click="handler.requestRedo()" :disabled="!canRedo">
      <p>Redo</p>
    </button> -->
    <div class="score" v-for="i in handler.getPlayerCount()" :key="i">
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

.play {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  flex-grow: 1;

  // TODO: Assumes 2 players.
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  .play {
    // TODO: Assumes 2 players.
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;

    // Keeps the buttons no taller than square.
    max-height: calc((100vw + 3rem) / 2);
  }
}
</style>
