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
  <button @click="handleButtonClick" :disabled="!canIncrement">
    {{ score.getScoreString(state as GameStateType, playerIndex) }}
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
