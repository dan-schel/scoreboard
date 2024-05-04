<script setup lang="ts">
import { fetchAllSavedMatches } from "@/data/game/persistence";
import { ref } from "vue";

const savedGames = ref(fetchAllSavedMatches());
const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});
</script>

<template>
  <div class="saves">
    <p v-if="savedGames.length == 0" class="empty">No saved games to load.</p>

    <template v-for="(save, i) in savedGames" :key="i">
      <div class="save corrupted" v-if="save.error" disabled>
        <p class="game">{{ save.game?.name ?? "Unknown game" }}</p>
        <p class="state">Corrupted save</p>
        <p class="date">
          {{ formatter.format(save.datetime) }}
        </p>
      </div>
      <RouterLink
        class="save"
        v-else
        :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
      >
        <p class="game">{{ save.game.name }}</p>
        <p class="state">
          {{ save.state.toDisplayString() }}
        </p>
        <p class="date">
          {{ formatter.format(save.datetime) }}
        </p>
      </RouterLink>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.saves {
  gap: 4rem;
}

.empty {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-ink-60);
}

.save {
  .game {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  .state {
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-ink-100);
    margin-bottom: 1.5rem;
  }
  .date {
    font-size: 2rem;
  }

  &.corrupted .state {
    color: var(--color-error);
  }
}
</style>
