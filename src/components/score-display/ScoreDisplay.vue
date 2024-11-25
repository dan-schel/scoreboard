<script setup lang="ts" generic="GameStateType extends GameState">
import {
  SimpleScoreType,
  type GameState,
  type ScoreType,
  type Action,
} from "@/data/game/game";
import SimpleScoreDisplay from "./SimpleScoreDisplay.vue";
import { TennisScoreType } from "@/data/game-library/tennis/tennis-score-type";
import { TennisState } from "@/data/game-library/tennis/tennis-state";
import TennisScoreDisplay from "./TennisScoreDisplay.vue";

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
  <TennisScoreDisplay
    v-else-if="score instanceof TennisScoreType && state instanceof TennisState"
    :score="score"
    :state="state"
    :playerIndex="playerIndex"
    @submit-action="(action) => $emit('submit-action', action)"
  >
  </TennisScoreDisplay>
</template>
