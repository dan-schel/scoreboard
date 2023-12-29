<script setup lang="ts">
import { gameLibrary } from "@/data/game-library/game-library";
import { RouterLink } from "vue-router";
</script>

<template>
  <main>
    <h1>Scoreboard</h1>
    <p>Select game:</p>
    <ul>
      <li v-for="[id, game] in gameLibrary" :key="id">
        <RouterLink class="link" :to="{ path: `/${id}` }">{{
          game.name
        }}</RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

main {
  padding: 2rem;
  gap: 1rem;
}
h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-ink-100);
}
ul {
  margin-left: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
}
</style>
