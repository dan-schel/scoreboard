<script setup lang="ts" generic="GameStateType extends GameState">
import {
  SimpleScoreType,
  type GameState,
  type ScoreType,
  type Action,
} from "@/data/game/game";
import SimpleScoreDisplay from "./SimpleScoreDisplay.vue";

defineProps<{
  score: ScoreType;
  state: GameStateType;
  playerIndex: number;
}>();

defineEmits<{
  (e: "submit-action", action: Action): void;
}>();
</script>

<template>
  <SimpleScoreDisplay
    v-if="score instanceof SimpleScoreType"
    :score="score"
    :state="state"
    :playerIndex="playerIndex"
    @submit-action="(action) => $emit('submit-action', action)"
  >
  </SimpleScoreDisplay>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
