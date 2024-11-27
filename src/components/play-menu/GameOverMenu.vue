<script setup lang="ts">
import { RouterLink } from "vue-router";
import PhHouseBold from "../icons/PhHouseBold.vue";
import PhXBold from "../icons/PhXBold.vue";
import {
  getAccentColorDisplayString,
  type AccentColor,
} from "@/data/game-utils/accent-color";
import PhArrowsClockwiseBold from "../icons/PhArrowsClockwiseBold.vue";

defineProps<{
  winnerColor: AccentColor | null;
  gameId: string;
  instanceUuid: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div class="menu" :class="{ [`accent-${winnerColor}`]: winnerColor != null }">
    <div class="header">
      <p v-if="winnerColor != null">
        <span class="winner-color">{{
          getAccentColorDisplayString(winnerColor)
        }}</span>
        wins!
      </p>
      <p v-else>It's a draw!</p>
      <button @click="$emit('close')">
        <PhXBold></PhXBold>
      </button>
    </div>
    <div class="actions">
      <RouterLink
        :to="{
          name: 'new-game',
          params: { game: gameId },
          query: { rematch: instanceUuid },
        }"
      >
        <PhArrowsClockwiseBold></PhArrowsClockwiseBold>
        <p>Rematch</p>
      </RouterLink>
      <RouterLink :to="{ name: 'home' }">
        <PhHouseBold></PhHouseBold>
        <p>Exit to menu</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;

.menu {
  @include colors.accent-classes;
  padding: 2rem;
  min-width: 20rem;
  gap: 1rem;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  > p {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-strong);
  }

  .winner-color {
    font-weight: bold;
    color: var(--color-accent);
  }

  button {
    @include template.button-filled-neutral;
    --button-rounding: 1.25rem;
    height: 2.5rem;
    width: 2.5rem;
    align-items: center;
    justify-content: center;

    svg {
      font-size: 1.25rem;
    }
  }
}

.actions {
  gap: 1rem;

  button,
  a {
    @include template.button-classic;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem;

    svg {
      font-size: 1.5rem;
    }
  }
}
</style>
