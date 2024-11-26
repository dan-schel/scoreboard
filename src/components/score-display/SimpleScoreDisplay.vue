<script setup lang="ts" generic="GameStateType extends GameState">
import type { Action, GameState, SimpleScoreType } from "@/data/game/game";
import { computed } from "vue";

const props = defineProps<{
  score: SimpleScoreType<GameStateType>;
  state: GameStateType;
  playerIndex: number;
}>();

const emit = defineEmits<{
  (e: "submit-action", action: Action): void;
}>();

const canIncrement = computed(() =>
  props.score.canIncrementScore(props.state, props.playerIndex),
);

function handleButtonClick() {
  const action = props.score.getIncrementAction(props.state, props.playerIndex);
  emit("submit-action", action);
}
</script>

<template>
  <button
    @click="handleButtonClick"
    :disabled="!canIncrement"
    class="score-button"
    :class="`accent-${score.getPlayerColor(playerIndex)}`"
  >
    <p>{{ score.getScoreString(state as GameStateType, playerIndex) }}</p>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.score-button {
  @include bsc.button-solid-color;
  @include colors.accent-classes;
  @include template.content-text;
  --button-rounding: 1rem;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  p {
    font-weight: bold;
    font-size: 10rem;
  }
}
</style>
