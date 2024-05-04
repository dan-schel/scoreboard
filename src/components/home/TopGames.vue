<script setup lang="ts">
import { gameLibrary } from "@/data/game-library/game-library";
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="top-games">
    <RouterLink
      v-for="[id, game] in gameLibrary"
      :key="id"
      :to="{ path: `/${id}` }"
      class="game"
    >
      <p>{{ game.name }}</p>
    </RouterLink>
    <div class="more">
      <p>Other</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/player-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.top-games {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2rem;
}

.game,
.more {
  @include template.content-text;
  --button-rounding: 1rem;
  align-items: center;
  justify-content: flex-end;
  padding: 2rem;

  p {
    font-weight: bold;
    font-size: 3rem;
    text-align: center;
  }
}
.game {
  @include bsc.button-solid-color;
  @include colors.accent-classes;
}
.more {
  @include template.button-filled-neutral;
}
</style>
