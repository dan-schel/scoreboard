<script setup lang="ts">
import type { TennisState } from "@/data/game-library/tennis/tennis-state";
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

const canIncrement = computed(() => props.score.canIncrementScore(props.state));

const canFault = computed(() =>
  props.score.canFault(props.state, props.playerIndex),
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

function handleIncrementButtonClick() {
  const action = props.score.getIncrementAction(props.playerIndex);
  emit("submit-action", action);
}

function handleFaultButtonClick() {
  const action = props.score.getFaultAction();
  emit("submit-action", action);
}
</script>

<template>
  <div class="container" :class="`accent-${score.getPlayerColor(playerIndex)}`">
    <button
      @click="handleIncrementButtonClick"
      :disabled="!canIncrement"
      class="score-button"
    >
      <p class="primary">
        {{ score.getPrimaryScoreString(state, playerIndex) }}
      </p>
      <p class="set-history">
        {{ score.getSetHistoryString(state, playerIndex) }}
      </p>
    </button>
    <div class="serve-overlay" v-if="serveDirection != null">
      <p>Serve: {{ serveDirection }}</p>
    </div>
    <button
      v-if="serveDirection != null"
      class="fault-button"
      @click="handleFaultButtonClick"
      :disabled="!canFault"
      :class="{
        'is-fault': score.isFault(state),
        p1: playerIndex === 0,
        p2: playerIndex === 1,
      }"
    >
      <div class="fault-status">
        <p>F</p>
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.container {
  @include colors.accent-classes;
  --color-player-accent: var(--color-accent);

  // For the serve overlay.
  position: relative;
  flex-grow: 1;
}

.score-button {
  @include bsc.button-solid-color;
  @include template.content-text;
  --button-rounding: 1.5rem;
  flex-grow: 1;
  z-index: 0;

  display: grid;
  grid-template-rows: 1fr 10rem 4rem 1fr;
  align-items: center;
  justify-items: center;

  .primary {
    font-weight: bold;
    font-size: 10rem;
    grid-row: 2;
  }
  .set-history {
    font-weight: bold;
    font-size: 4rem;
    grid-row: 3;
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
  border-radius: 1.5rem;
  z-index: 2;

  p {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-text-strong);
    margin: -0.5rem;
    border-radius: 0 0 1.5rem 1.5rem;
    padding: 1rem 2rem;
    color: var(--color-on-accent);
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }
}

.fault-button {
  @include bsc.button-solid-color;
  --button-rounding: 0.6rem;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  z-index: 1;

  position: absolute;
  top: 1rem;

  &.p1 {
    left: 1rem;
  }
  &.p2 {
    right: 1rem;
  }

  --color-accent: var(--color-background);

  .fault-status {
    border-radius: 0.25rem;
    height: 3rem;
    width: 3rem;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-strong);
  }

  &.is-fault {
    .fault-status {
      background-color: var(--color-text-strong);
    }
    p {
      color: var(--color-background);
    }
  }
}
</style>
