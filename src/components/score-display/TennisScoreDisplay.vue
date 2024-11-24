<script setup lang="ts">
import type { TennisState } from "@/data/game-library/tennis/tennis";
import { TennisScore } from "@/data/game-library/tennis/tennis-score";
import type { TennisScoreType } from "@/data/game-library/tennis/tennis-score-type";
import type { Action } from "@/data/game/game";
import { computed } from "vue";

const props = defineProps<{
  score: TennisScoreType;
  state: TennisState;
  playerIndex: number;
}>();

const emit = defineEmits<{
  (e: "submit-action", action: Action): void;
}>();

const canIncrement = computed(() =>
  props.score.canIncrementScore(props.state, props.playerIndex),
);

const serveDirection = computed(() => {
  if (!props.state.isServing(props.playerIndex)) {
    return null;
  }
  const side = TennisScore.determineServeSide(
    props.state.player1Score,
    props.state.player2Score,
  );
  return {
    left: "Left",
    right: "Right",
  }[side];
});

function handleButtonClick() {
  const action = props.score.getIncrementAction(props.state, props.playerIndex);
  emit("submit-action", action);
}
</script>

<template>
  <div class="container">
    <button
      @click="handleButtonClick"
      :disabled="!canIncrement"
      class="score-button"
      :class="`accent-${score.getPlayerColor(playerIndex)}`"
    >
      <p>{{ score.getPrimaryScoreString(state, playerIndex) }}</p>
    </button>
    <div class="serve-overlay" v-if="serveDirection != null">
      <p>Serve: {{ serveDirection }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/player-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.container {
  // For the serve overlay.
  position: relative;
  flex-grow: 1;
}

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

.serve-overlay {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0.5rem solid var(--color-text-strong);
  border-radius: 1rem;

  p {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-text-strong);
    margin: -0.5rem;
    border-radius: 0 0 1rem 1rem;
    padding: 1rem 2rem;
    color: var(--color-on-accent);
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>
