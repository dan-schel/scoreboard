<script
  setup
  lang="ts"
  generic="
    PlayerConfigType extends PlayerConfig,
    GameConfigType extends GameConfig<PlayerConfigType>,
    GameStateType extends GameState<any>
  "
>
import { Game, type GameState } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import type { PlayerConfig } from "@/data/game/player-config";
import {
  GameStateManager,
  LocalGameStateManager,
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

function handleStateUpdate(newState: GameStateType) {
  gameState.value = newState;
}

onMounted(() => {
  stateManager.value.addEventListener("stateupdate", handleStateUpdate);
});
onUnmounted(() => {
  stateManager.value.removeEventListener("stateupdate", handleStateUpdate);
});
</script>

<template>
  <p>Play game</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
