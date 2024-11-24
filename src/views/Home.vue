<script setup lang="ts">
import SavedGames from "@/components/home/SavedGames.vue";
import TopGames from "@/components/home/TopGames.vue";
import PageCenterer from "@/components/PageCenterer.vue";
</script>

<template>
  <PageCenterer>
    <main>
      <div class="new-game">
        <h1>SCOREBOARD</h1>
        <TopGames class="top-games"></TopGames>
      </div>
      <div class="history">
        <h2>History</h2>
        <SavedGames class="saves-list" />
      </div>
    </main>
  </PageCenterer>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

main {
  gap: 3rem;
  padding: 3rem 2rem;
}

.new-game {
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-text-strong);
    margin-bottom: 2rem;
  }
}
.history {
  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-strong);
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  main {
    padding: 4rem;
    gap: 4rem;

    display: grid;
    grid-template-columns: 20rem 1fr;
    grid-template-rows: 1fr;
    align-items: start;
  }
}
</style>
