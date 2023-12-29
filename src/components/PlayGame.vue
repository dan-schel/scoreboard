<script
  setup
  lang="ts"
  generic="
    GameConfigType extends GameConfig,
    GameStateType extends GameState<any>
  "
>
import type { Game, GameState } from "@/data/games/game";
import type { GameConfig } from "@/data/games/game-config";

defineProps<{
  game: Game<GameConfigType, GameStateType>;
  config: GameConfigType;
}>();
</script>

<template>
  <p>Play game</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
