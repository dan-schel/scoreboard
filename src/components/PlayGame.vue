<script
  setup
  lang="ts"
  generic="
    PlayerConfigType extends PlayerConfig,
    GameConfigType extends GameConfig<PlayerConfigType>,
    GameStateType extends GameState
  "
>
import { Game, type GameState } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import type { PlayerConfig } from "@/data/game/player-config";
import {
  GameStateManager,
  LocalGameStateManager,
  type StateUpdateType,
} from "@/data/game/state-manager";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const props = defineProps<{
  game: Game<PlayerConfigType, GameConfigType, GameStateType>;
  config: GameConfigType;
}>();

const gameState = ref(
  props.game.initialState(props.config),
) as Ref<GameStateType>;
const stateManager = ref<GameStateManager<GameStateType>>(
  new LocalGameStateManager(gameState.value),
);
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
  <button @click="stateManager.requestUndo()" :disabled="!canUndo">Undo</button>
  <button @click="stateManager.requestRedo()" :disabled="!canRedo">Redo</button>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

button {
  @include template.button-classic;
}
</style>
