<script
  setup
  lang="ts"
  generic="GameConfigType extends GameConfig, GameStateType extends GameState"
>
import type { GameBuilder, GameState } from "@/data/game/game";
import { GameConfig } from "@/data/game/game-config";
import ConfigureGame from "./ConfigureGame.vue";
import { ref, watch, type Ref } from "vue";
import PlayGame from "./PlayGame.vue";

const props = defineProps<{
  game: GameBuilder<GameConfigType, GameStateType>;
}>();

const config = ref<GameConfigType | null>(null) as Ref<GameConfigType | null>;

watch(
  () => props.game,
  () => {
    config.value = null;
  },
);

function handleGameConfigured(newConfig: GameConfigType) {
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
