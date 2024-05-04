<script setup lang="ts">
import Viewport from "@/components/Viewport.vue";
import SavedGames from "@/components/home/SavedGames.vue";
import TopGames from "@/components/home/TopGames.vue";
</script>

<template>
  <Viewport>
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
  </Viewport>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4rem;
  gap: 4rem;
  flex-grow: 1;
}

.new-game {
  h1 {
    font-size: 6rem;
    font-weight: bold;
    color: var(--color-ink-100);
    margin-bottom: 2rem;
  }
  .top-games {
    flex-grow: 1;
  }
}
.history {
  h2 {
    font-size: 4rem;
    font-weight: bold;
    color: var(--color-ink-100);

    // Line up with 6rem tall "SCOREBOARD" title.
    margin-top: 2rem;

    margin-bottom: 3rem;
  }
}
</style>
