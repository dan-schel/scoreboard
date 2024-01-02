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
    <p v-if="savedGames.length == 0">No saved games to load.</p>

    <template v-for="(save, i) in savedGames" :key="i">
      <div class="save corrupted" v-if="save.error" disabled>
        <p class="title">{{ save.game?.name ?? "Unknown game" }}</p>
        <p class="description">Corrupted save</p>
        <p class="date">
          {{ formatter.format(save.datetime) }}
        </p>
      </div>
      <RouterLink
        class="save"
        v-else
        :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
      >
        <p class="title">{{ save.game.name }}</p>
        <p class="description">
          {{ save.state.toDisplayString(save.instance.config) }}
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
  gap: 0.5rem;
}
.save {
  @include template.button-filled-neutral;
  padding: 1rem;

  &.corrupted .description {
    color: var(--color-error);
  }
}
.title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-ink-100);
  margin-bottom: 0.5rem;
}
.description {
  margin-bottom: 1rem;
}
.date {
  font-size: 0.8rem;
}
</style>
