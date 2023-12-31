<script setup lang="ts" generic="GameStateType extends GameState">
import type { GameState } from "@/data/game/game";
import { GameStateManager } from "@/data/game/state-manager";
import { onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  stateManager: GameStateManager<GameStateType>;
}>();

const canUndo = ref(props.stateManager.canUndo());
const canRedo = ref(props.stateManager.canRedo());

function handleUndoRedoAvailabilityChange(
  nowCanUndo: boolean,
  nowCanRedo: boolean,
) {
  canUndo.value = nowCanUndo;
  canRedo.value = nowCanRedo;
}

watch(
  () => props.stateManager,
  (newStateManager, oldStateManager) => {
    if (oldStateManager != null) {
      oldStateManager.removeUndoRedoAvailabilityListener(
        handleUndoRedoAvailabilityChange,
      );
    }

    newStateManager.addUndoRedoAvailabilityListener(
      handleUndoRedoAvailabilityChange,
    );
    canUndo.value = newStateManager.canUndo();
    canRedo.value = newStateManager.canRedo();
  },
  { immediate: true },
);

onUnmounted(() => {
  props.stateManager.removeUndoRedoAvailabilityListener(
    handleUndoRedoAvailabilityChange,
  );
});
</script>

<template>
  <button @click="stateManager.requestUndo()" :disabled="!canUndo">Undo</button>
  <button @click="stateManager.requestRedo()" :disabled="!canRedo">Redo</button>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
