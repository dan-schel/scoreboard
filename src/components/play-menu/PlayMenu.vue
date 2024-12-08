<script setup lang="ts">
import { RouterLink } from "vue-router";
import PhArrowArcLeftBold from "../icons/PhArrowArcLeftBold.vue";
import PhArrowArcRightBold from "../icons/PhArrowArcRightBold.vue";
import PhHeadphonesBold from "../icons/PhHeadphonesBold.vue";
import PhHouseBold from "../icons/PhHouseBold.vue";
import PhXBold from "../icons/PhXBold.vue";
import { routes } from "@/router";
import PhArrowsClockwiseBold from "../icons/PhArrowsClockwiseBold.vue";

defineProps<{
  canUndo: boolean;
  canRedo: boolean;
  isGameOver: boolean;
  gameId: string;
  instanceUuid: string;
}>();

defineEmits<{
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "earbud-mode"): void;
  (e: "close"): void;
}>();
</script>

<template>
  <div class="menu">
    <div class="header">
      <p>Menu</p>
      <button @click="$emit('close')">
        <PhXBold></PhXBold>
      </button>
    </div>
    <div class="undo-redo">
      <button @click="$emit('undo')" :disabled="!canUndo">
        <PhArrowArcLeftBold></PhArrowArcLeftBold>
        <p>Undo</p>
      </button>
      <button @click="$emit('redo')" :disabled="!canRedo">
        <PhArrowArcRightBold></PhArrowArcRightBold>
        <p>Redo</p>
      </button>
    </div>
    <div class="other">
      <button @click="$emit('earbud-mode')">
        <PhHeadphonesBold></PhHeadphonesBold>
        <p>Earbud mode</p>
      </button>
      <RouterLink v-if="isGameOver" :to="routes.rematch(gameId, instanceUuid)">
        <PhArrowsClockwiseBold></PhArrowsClockwiseBold>
        <p>Rematch</p>
      </RouterLink>
      <RouterLink :to="routes.home()">
        <PhHouseBold></PhHouseBold>
        <p>Leave game</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.menu {
  padding: 2rem;
  min-width: 20rem;
  gap: 1rem;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;

  > p {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-strong);
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

.undo-redo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  button {
    @include template.button-classic;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    padding: 1rem;

    svg {
      font-size: 1.5rem;
    }
  }
}

.other {
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
