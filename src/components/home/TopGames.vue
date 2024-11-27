<script setup lang="ts">
import { gameLibrary } from "@/data/game-library/game-library";
import { RouterLink } from "vue-router";
import PhSquaresFourFill from "../icons/PhSquaresFourFill.vue";
import { routes } from "@/router";
import GameIcon from "./GameIcon.vue";
</script>

<template>
  <div class="top-games">
    <RouterLink
      v-for="[id, game] in gameLibrary"
      :key="id"
      :to="routes.newGame(id)"
      :class="`game accent-${game.color}`"
    >
      <GameIcon :id="id"></GameIcon>
      <p>{{ game.name }}</p>
    </RouterLink>
    <RouterLink class="more" :to="routes.allGames()">
      <PhSquaresFourFill></PhSquaresFourFill>
      <p>Other</p>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.top-games {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
}

.game,
.more {
  @include template.content-text-icon;
  --button-rounding: 1rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.5rem;
  aspect-ratio: 1;

  p {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
  }
  svg {
    font-size: 3rem;
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
