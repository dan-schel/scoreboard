<script setup lang="ts" generic="GameConfigType extends GameConfig">
import type { Game } from "@/data/games/game";
import type { GameConfig } from "@/data/games/game-config";

const props = defineProps<{
  game: Game<GameConfigType>;
}>();
const emit = defineEmits<{
  (e: "submit", config: GameConfigType): void;
}>();

function handleFormSubmit(e: Event) {
  e.preventDefault();
  emit("submit", props.game.configShape.defaultConfig);
}
</script>

<template>
  <p>Configure game</p>
  <form autocomplete="off" @submit="handleFormSubmit">
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
button {
  @include template.button-classic;
}
</style>
