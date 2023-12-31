<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import { Game, type GameState } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import {
  GameStateManager,
  LocalGameStateManager,
  type StateUpdateType,
} from "@/data/game/state-manager";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import UndoRedoButtons from "./UndoRedoButtons.vue";

const props = defineProps<{
  game: Game<GameConfigType, GameStateType>;
  config: GameConfigType;
}>();

const gameState = ref(
  props.game.getInitialState(props.config),
) as Ref<GameStateType>;
const stateManager = ref<GameStateManager<GameStateType>>(
  new LocalGameStateManager(gameState.value),
) as Ref<GameStateManager<GameStateType>>;
const canUndo = ref(stateManager.value.canUndo());
const canRedo = ref(stateManager.value.canRedo());

function handleStateUpdate(
  newState: GameStateType,
  _updateType: StateUpdateType,
) {
  gameState.value = newState;
}
function handleUndoRedoAvailabilityChange(
  nowCanUndo: boolean,
  nowCanRedo: boolean,
) {
  canUndo.value = nowCanUndo;
  canRedo.value = nowCanRedo;
}

onMounted(() => {
  stateManager.value.addStateUpdateListener(handleStateUpdate);
  stateManager.value.addUndoRedoAvailabilityListener(
    handleUndoRedoAvailabilityChange,
  );
});

onUnmounted(() => {
  stateManager.value.removeStateUpdateListener(handleStateUpdate);
  stateManager.value.removeUndoRedoAvailabilityListener(
    handleUndoRedoAvailabilityChange,
  );
});
</script>

<template>
  <p>Play game</p>
  <UndoRedoButtons :state-manager="stateManager"></UndoRedoButtons>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

button {
  @include template.button-classic;
}
</style>
