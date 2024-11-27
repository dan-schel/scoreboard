<script setup lang="ts">
import GameIcon from "@/components/home/GameIcon.vue";
import PhArrowLeftBold from "@/components/icons/PhArrowLeftBold.vue";
import PageCenterer from "@/components/PageCenterer.vue";
import { gameLibrary } from "@/data/game-library/game-library";
import { routes } from "@/router";
import { RouterLink } from "vue-router";
</script>

<template>
  <PageCenterer>
    <main>
      <RouterLink class="back-button" :to="routes.home()">
        <PhArrowLeftBold></PhArrowLeftBold>
        <p>Back</p>
      </RouterLink>
      <div class="divider"></div>
      <div>
        <h1>All games</h1>
        <div class="list">
          <RouterLink
            v-for="[id, game] in gameLibrary"
            :key="id"
            :to="routes.newGame(id)"
            :class="`game accent-${game.color}`"
          >
            <div class="color-block"></div>
            <div class="content">
              <GameIcon :id="id"></GameIcon>
              <p>{{ game.name }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </main>
  </PageCenterer>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

main {
  @include colors.accent-classes;
  padding: 3rem 2rem;
  gap: 2rem;
  flex-grow: 1;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text-strong);
  margin-bottom: 2rem;
}

.back-button {
  @include template.button-filled-neutral;
  @include template.row;
  align-self: start;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
}

.divider {
  background-color: var(--color-soft-border);
}

.list {
  gap: 1rem;
}

.game {
  @include template.button-hover;
  display: grid;
  grid-template-columns: 0.5rem 1fr;

  .color-block {
    background-color: var(--color-accent);
  }
  .content {
    @include template.row;
    padding: 0.5rem 1rem;
    gap: 1rem;
    svg {
      font-size: 3rem;
      color: var(--color-accent);
    }
    p {
      font-size: 1.5rem;
    }
  }
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  main {
    display: grid;
    grid-template-columns: auto auto 1fr;
    padding: 4rem;
  }
  .divider {
    width: 2px;
  }
}

@media screen and (max-width: 47.999rem) {
  .divider {
    height: 2px;
    margin-top: -1rem;
  }
}
</style>
