<script setup lang="ts">
import GameController from "@/components/GameController.vue";
import { gameLibrary } from "@/data/games/game-library";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const params = ref(route.params);
watch(route, () => {
  // This is called even when navigating away from the page, hence the check.
  if (route.name == "game") {
    params.value = route.params;
  }
});

const game = computed(() => {
  return gameLibrary.get(params.value.game as string) ?? null;
});
</script>

<template>
  <main v-if="game != null">
    <GameController :game="game"></GameController>
  </main>
  <main v-else class="not-found">
    <h1>Error 404 - Game not found</h1>
    <p>
      This page doesn&apos;t exist, at least not anymore! The game you&apos;re
      looking for might have been renamed or removed. Check the homepage to see
      which games are available.
    </p>
    <p>
      <RouterLink class="link" :to="{ name: 'home' }">
        Here&apos;s a link to the homepage.
      </RouterLink>
    </p>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.not-found {
  padding: 2rem;
  height: 100vh;
  height: 100svh;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-ink-100);
  }
  * {
    text-align: center;
  }
}
</style>
