<script setup lang="ts">
import { gameLibrary } from "@/data/game-library/game-library";
import { fetchAllSavedMatches } from "@/data/game/persistence";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const savedGames = ref(fetchAllSavedMatches());
</script>

<template>
  <main>
    <h1>Scoreboard</h1>
    <p>Start a new game:</p>
    <ul>
      <li v-for="[id, game] in gameLibrary" :key="id">
        <RouterLink class="link" :to="{ path: `/${id}` }">{{
          game.name
        }}</RouterLink>
      </li>
    </ul>
    <p>Or load a saved game:</p>
    <ul>
      <li v-for="(save, i) in savedGames" :key="i">
        <span v-if="save.error">Corrupted save.</span>
        <RouterLink
          v-else
          class="link"
          :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
          >{{ save.game.name }}</RouterLink
        >
      </li>
      <li v-if="savedGames.length == 0">No saved games to load.</li>
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
