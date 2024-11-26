<script setup lang="ts" generic="GameConfigType extends GameConfig">
import type { GameConfig } from "@/data/game/config/config";
import type { GameBuilder } from "@/data/game/game";
import { ref } from "vue";
import PropObjectEditor from "./configure/PropObjectEditor.vue";
import type { PropObjectValue } from "@/data/game/config/prop-object";

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

  const results = props.game.configWriter.validate(config.value);

  console.log(results);

  if (results.isValid) {
    emit("submit", props.game.configWriter.build(results.validated));
  } else {
    config.value = results.validated;
  }
}
</script>

<template>
  <div class="configure">
    <h1>Configure game</h1>
    <p class="game-name">{{ game.name }}</p>
    <form autocomplete="off" @submit="handleFormSubmit">
      <PropObjectEditor
        :prop="game.configWriter.configProp"
        :value="config"
        @change="handleConfigChange"
      />
      <button type="submit" class="play-button"><p>Play!</p></button>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.configure {
  padding: 3rem 2rem;
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

.play-button {
  @include template.button-classic;
  padding: 1rem;
  align-items: center;
  p {
    text-align: center;
  }
}

// Desktop layout.
@media screen and (min-width: 48rem) {
  .configure {
    padding: 4rem;
  }
}
</style>
