<script
  setup
  lang="ts"
  generic="
    PlayerConfigType extends PlayerConfig,
    GameConfigType extends GameConfig<PlayerConfigType>,
    GameStateType extends GameState<any>
  "
>
import type { Game, GameState } from "@/data/games/game";
import { GameConfig } from "@/data/games/game-config";
import ConfigureGame from "./ConfigureGame.vue";
import { ref, type Ref } from "vue";
import PlayGame from "./PlayGame.vue";
import type { PlayerConfig } from "@/data/games/player-config";

const config = ref<GameConfigType | null>(null) as Ref<GameConfigType | null>;

defineProps<{
  game: Game<PlayerConfigType, GameConfigType, GameStateType>;
}>();

function handleGameConfigured(newConfig: GameConfigType) {
  console.log("Config submitted", newConfig);
  config.value = newConfig;
}
</script>

<template>
  <h1>{{ game.name }}</h1>
  <ConfigureGame
    v-if="config == null"
    :game="game"
    @submit="handleGameConfigured"
  ></ConfigureGame>
  <PlayGame v-else :game="game" :config="config"></PlayGame>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
