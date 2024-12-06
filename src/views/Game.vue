<script setup lang="ts">
import GameController from "@/components/GameController.vue";
import PageCenterer from "@/components/PageCenterer.vue";
import { gameLibrary } from "@/data/game-library/game-library";
import { routes } from "@/router";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const gameID = ref(route.params.game as string);
const uuid = ref(route.params.uuid as string);
const rematchOf = ref(route.query.rematch as string);

watch(
  [() => route.params.game, () => route.params.uuid, () => route.query.rematch],
  () => {
    gameID.value = route.params.game as string;
    uuid.value = route.params.uuid as string;
    rematchOf.value = route.query.rematch as string;
  },
);
const game = computed(() => {
  return gameLibrary.get(gameID.value) ?? null;
});
</script>

<template>
  <PageCenterer>
    <main v-if="game != null">
      <GameController
        :game="game"
        :uuid="uuid"
        :rematch-of="rematchOf"
        :key="uuid"
      ></GameController>
    </main>
    <main v-else class="not-found">
      <h1>Error 404 - Game not found</h1>
      <p>This page doesn&apos;t exist, at least not anymore!</p>
      <p>
        The game you&apos;re looking for might have been renamed or removed.
        Check the homepage to see which games are available.
      </p>
      <p>
        <RouterLink class="link" :to="routes.home()">
          Here&apos;s a link to the homepage.
        </RouterLink>
      </p>
    </main>
  </PageCenterer>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

main {
  flex-grow: 1;
}
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
    color: var(--color-text-strong);
  }
  * {
    text-align: center;
  }
}
</style>
