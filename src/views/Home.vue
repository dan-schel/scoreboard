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
    <h2>Start a new game:</h2>
    <ul>
      <li v-for="[id, game] in gameLibrary" :key="id">
        <RouterLink class="link" :to="{ path: `/${id}` }">{{
          game.name
        }}</RouterLink>
      </li>
    </ul>
    <h2>Or load a saved game:</h2>
    <div class="saves">
      <p v-if="savedGames.length == 0">No saved games to load.</p>

      <template v-for="(save, i) in savedGames" :key="i">
        <div class="save" v-if="save.error">
          <h3>{{ save.game?.name ?? "Unknown game" }}</h3>
          <p>Corrupted save.</p>
          <p>{{ save.datetime }}</p>
        </div>
        <RouterLink
          class="save"
          v-else
          :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
        >
          <h3>{{ save.game.name }}</h3>
          <p>
            {{ save.state.toDisplayString(save.instance.config) }}
          </p>
          <p>{{ save.datetime }}</p>
        </RouterLink>
      </template>
    </div>
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
