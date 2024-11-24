<script setup lang="ts" generic="GameStateType extends GameState">
import { type GameState } from "@/data/game/game";
import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { type GameHandler } from "@/data/game/game-handler";
import ScoreDisplay from "./score-display/ScoreDisplay.vue";
import PhDotsThreeOutlineFill from "./icons/PhDotsThreeOutlineFill.vue";
import PlayMenu from "./play-menu/PlayMenu.vue";
import EarbudModeMenu from "./play-menu/EarbudModeMenu.vue";

const props = defineProps<{
  handler: GameHandler<GameStateType>;
}>();

const gameState = ref(props.handler.getState()) as Ref<GameStateType>;
const canUndo = ref(props.handler.canUndo());
const canRedo = ref(props.handler.canRedo());

const dialogRef = ref<HTMLDialogElement | null>(null);
const dialogPage = ref<"main" | "earbud-mode">("main");

function handleStateUpdate() {
  gameState.value = props.handler.getState();
  canUndo.value = props.handler.canUndo();
  canRedo.value = props.handler.canRedo();
}

function handleMenuButton() {
  dialogRef.value?.showModal();
  dialogPage.value = "main";
}

watch(
  () => props.handler,
  (newValue, oldValue) => {
    if (oldValue != null) {
      oldValue.removeChangeListener(handleStateUpdate);
    }
    newValue.addChangeListener(handleStateUpdate);
    handleStateUpdate();
  },
);

onMounted(() => {
  props.handler.addChangeListener(handleStateUpdate);
});
onUnmounted(() => {
  props.handler.removeChangeListener(handleStateUpdate);
});
</script>

<template>
  <div class="play">
    <div class="mobile-row">
      <div class="score-headline">
        <p>BREAK POINT</p>
      </div>
      <button class="menu-button" @click="handleMenuButton">
        <PhDotsThreeOutlineFill></PhDotsThreeOutlineFill>
      </button>
    </div>
    <div class="score" v-for="i in handler.getPlayerCount()" :key="i">
      <ScoreDisplay
        v-for="scoreType in handler.getScoreTypes()"
        :key="scoreType.id"
        :score="scoreType"
        :state="gameState"
        :playerIndex="i - 1"
        @submit-action="(action) => handler.do(action)"
      >
      </ScoreDisplay>
    </div>
  </div>
  <dialog ref="dialogRef">
    <EarbudModeMenu
      v-if="dialogPage === 'earbud-mode'"
      @back="dialogPage = 'main'"
    >
    </EarbudModeMenu>
    <PlayMenu
      v-else
      class="menu"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @undo="handler.requestUndo()"
      @redo="handler.requestRedo()"
      @earbud-mode="dialogPage = 'earbud-mode'"
      @close="dialogRef?.close()"
    ></PlayMenu>
  </dialog>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/button-solid-color" as bsc;

.play {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  flex-grow: 1;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
}

.score {
  z-index: 0;
}

.menu-button {
  @include bsc.button-solid-color;
  --button-rounding: 1.25rem;
  height: 4rem;
  width: 4rem;
  align-items: center;
  justify-content: center;
  z-index: 1;

  --color-accent: var(--color-background);

  svg {
    font-size: 2rem;
  }
}

.score-headline {
  background-color: var(--color-text-strong);
  border-radius: 1rem;
  padding: 1rem 2rem;
  align-items: center;
  justify-content: center;
  z-index: 1;
  p {
    color: var(--color-on-accent);
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }
}

dialog {
  @include template.dialog;
  border-radius: 1rem;
  max-width: min(calc(100vw - 2rem), 30rem);
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  .play {
    // For the menu button and score headline.
    position: relative;

    // TODO: Assumes 2 players.
    grid-template-columns: 1fr 1fr;

    // Keeps the buttons no taller than square.
    max-height: min(calc((100vw + 3rem) / 2), 41.5rem);
  }

  .mobile-row {
    // Acts as through the wrapper div "mobile-row" doesn't exist.
    display: contents;
  }

  .score-headline,
  .menu-button {
    position: absolute;
  }

  .score-headline {
    top: 3rem;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .menu-button {
    bottom: 0rem;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

// Mobile layout.
@media screen and (max-width: 47.999rem) {
  .play {
    // TODO: Assumes 2 players.
    grid-template-rows: auto 1fr 1fr;
  }

  .mobile-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 1rem;
  }
}
</style>
