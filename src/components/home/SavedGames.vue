<script setup lang="ts">
import {
  fetchAllSavedMatches,
  type LoadResults,
} from "@/data/game/persistence";
import { ref } from "vue";
import SavedGame from "./SavedGame.vue";
import type { GameState } from "@/data/game/game";

const savedGames = ref(fetchAllSavedMatches());

function handleSaveDeleted() {
  savedGames.value = fetchAllSavedMatches();
}

// Below, where this is used, I'm forced to do a type assertion for some reason.
// I think the value being used in a Vue ref is messing with it somehow, the
// private methods are being dropped or something? Also, doing it like this as a
// function is not really needed, I couldv'e done the type assertion inline, but
// doing so breaks the syntax highlighting (because of the angle brackets,
// presumably), so I've done it here instead so retain my sanity! :)
function coerced(save: any) {
  return save as LoadResults<GameState>;
}
</script>

<template>
  <div class="saves">
    <p v-if="savedGames.length == 0" class="empty">No saved games to load.</p>

    <SavedGame
      v-for="(save, i) in savedGames"
      :key="i"
      :save="coerced(save)"
      @deleted="handleSaveDeleted"
    >
    </SavedGame>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.saves {
  gap: 2rem;
}

.empty {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-weak);
}
</style>
