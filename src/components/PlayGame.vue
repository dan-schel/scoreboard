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
import type { GameConfig } from "@/data/games/game-config";
import type { PlayerConfig } from "@/data/games/player-config";

defineProps<{
  game: Game<PlayerConfigType, GameConfigType, GameStateType>;
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
