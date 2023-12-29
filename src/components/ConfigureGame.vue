<script
  setup
  lang="ts"
  generic="
    PlayerConfigType extends PlayerConfig,
    GameConfigType extends GameConfig<PlayerConfigType>
  "
>
import type { Game } from "@/data/game/game";
import type { GameConfig } from "@/data/game/game-config";
import type { PlayerConfig } from "@/data/game/player-config";

const props = defineProps<{
  game: Game<PlayerConfigType, GameConfigType>;
}>();
const emit = defineEmits<{
  (e: "submit", config: GameConfigType): void;
}>();

function handleFormSubmit(e: Event) {
  e.preventDefault();
  emit("submit", props.game.configAdapter.defaultConfig);
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
