<script setup lang="ts" generic="GameConfigType extends GameConfig">
import type { GameConfig } from "@/data/game/config/config";
import type { GameBuilder } from "@/data/game/game";
import { ref } from "vue";
import PropObjectEditor from "./configure/PropObjectEditor.vue";
import type { PropObjectValue } from "@/data/game/config/prop-object";
import PhArrowRightBold from "./icons/PhArrowRightBold.vue";
import PhArrowLeftBold from "./icons/PhArrowLeftBold.vue";
import { RouterLink } from "vue-router";
import { routes } from "@/router";

const props = defineProps<{
  game: GameBuilder<GameConfigType>;
}>();
const emit = defineEmits<{
  (e: "submit", config: GameConfigType): void;
}>();

const config = ref(props.game.configWriter.defaultValue());

function handleConfigChange(newConfig: PropObjectValue) {
  config.value = newConfig;
}

function handleFormSubmit(e: Event) {
  e.preventDefault();

  const validated = props.game.configWriter.validate(config.value);

  if (validated.isValid()) {
    emit("submit", props.game.configWriter.build(validated));
  } else {
    config.value = validated;
  }
}
</script>

<template>
  <div :class="`layout accent-${game.color}`">
    <RouterLink class="back-button" :to="routes.home()">
      <PhArrowLeftBold></PhArrowLeftBold>
      <p>Back</p>
    </RouterLink>
    <div class="divider"></div>
    <div class="configure">
      <h1>Configure game</h1>
      <p class="game-name">{{ game.name }}</p>
      <form autocomplete="off" @submit="handleFormSubmit">
        <PropObjectEditor
          :prop="game.configWriter.configProp"
          :value="config"
          @change="handleConfigChange"
          :nest-level="0"
        />
        <button type="submit" class="play-button">
          <p>Play!</p>
          <PhArrowRightBold></PhArrowRightBold>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;
@use "@/assets/accent-colors" as colors;
@use "@/assets/button-solid-color" as bsc;

.layout {
  @include colors.accent-classes;
  padding: 3rem 2rem;
  gap: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text-strong);
  margin-bottom: 1rem;
}

.game-name {
  font-size: 1.5rem;
  color: var(--color-accent);
  margin-bottom: 2rem;
}

form {
  gap: 2rem;
}

.play-button {
  @include bsc.button-solid-color;
  @include template.content-text-icon;
  @include template.row;

  padding: 0.75rem 1.5rem;
  align-items: center;
  align-self: flex-end;
  gap: 1rem;

  svg {
    font-size: 1.25rem;
  }
  p {
    text-align: center;
    font-weight: bold;
  }
}

.back-button {
  @include template.button-filled-neutral;
  @include template.row;
  align-self: start;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
}

.divider {
  background-color: var(--color-accent);
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  .layout {
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
