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
  grid-template-columns: 48rem 1fr;
  grid-template-rows: 1fr;
  gap: 4rem;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
}

.new-game {
  padding: 4rem;
  padding-right: 0rem;

  h1 {
    font-size: 6rem;
    font-weight: bold;
    color: var(--color-ink-100);
    margin-bottom: 2rem;
  }
  .top-games {
    flex-grow: 1;

    // 48rem (column width) - 4rem (left padding).
    max-height: 44rem;
  }
}
.history {
  padding: 4rem;
  padding-left: 0rem;

  overflow-y: scroll;
  min-height: 0;

  h2 {
    font-size: 4rem;
    font-weight: bold;
    color: var(--color-ink-100);
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
}
</style>
