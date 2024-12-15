<script setup lang="ts">
import type { EarbudInterface } from "@/data/game/earbud-interface";
import PhCaretLeftBold from "../icons/PhCaretLeftBold.vue";
import PhCheckBold from "../icons/PhCheckBold.vue";
import PhFastForwardBold from "../icons/PhFastForwardBold.vue";
import PhPlayPauseBold from "../icons/PhPlayPauseBold.vue";
import PhRewindBold from "../icons/PhRewindBold.vue";
import type { GameState } from "@/data/game/game";
import PhXBold from "../icons/PhXBold.vue";

defineProps<{
  interface: EarbudInterface<GameState, string> | null;
  isEnabled: boolean;
}>();

const supported = "mediaSession" in navigator;

defineEmits<{
  (e: "back"): void;
  (e: "enable"): void;
  (e: "disable"): void;
}>();
</script>

<template>
  <div class="menu">
    <div class="header">
      <button @click="$emit('back')">
        <PhCaretLeftBold></PhCaretLeftBold>
      </button>
      <p>Earbud Mode</p>
    </div>
    <p>
      Get audio score updates, and use the play/pause, previous track, and next
      track controls on your headphones to advance the score.
    </p>
    <div class="button-mapping">
      <PhPlayPauseBold></PhPlayPauseBold>
      <p>More options</p>
      <PhFastForwardBold></PhFastForwardBold>
      <p>Award point to Player 1</p>
      <PhRewindBold></PhRewindBold>
      <p>Award point to Player 2</p>
    </div>
    <hr />
    <p>After selecting "More options":</p>
    <div class="button-mapping">
      <PhPlayPauseBold></PhPlayPauseBold>
      <p>Repeat scores/Cancel</p>
      <PhFastForwardBold></PhFastForwardBold>
      <p>Fault</p>
      <PhRewindBold></PhRewindBold>
      <p>Undo</p>
    </div>
    <template v-if="!supported || interface == null">
      <hr />
      <p class="error" v-if="interface == null">
        Not available for this game right now.
      </p>
      <p class="error" v-else-if="!supported">
        Not supported - try another browser or device.
      </p>
    </template>
    <button
      class="enable-button"
      @click="$emit('enable')"
      v-if="!isEnabled"
      :disabled="!supported || interface == null"
    >
      <PhCheckBold></PhCheckBold>
      <p>Enable earbud mode</p>
    </button>
    <button class="disable-button" @click="$emit('disable')" v-else>
      <PhXBold></PhXBold>
      <p>Disable earbud mode</p>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.menu {
  padding: 2rem;
  min-width: 20rem;
  gap: 2rem;
}

.header {
  display: grid;
  grid-template-columns: auto 1fr;
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

.button-mapping {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;

  svg {
    font-size: 1.25rem;
  }
}

hr {
  border: none;
  color: none;
  border-top: 1px solid var(--color-soft-border);
}

.enable-button,
.disable-button {
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

.error {
  color: var(--color-error);
  font-weight: bold;
}
</style>
