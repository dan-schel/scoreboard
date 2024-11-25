<script setup lang="ts">
import type { GameState } from "@/data/game/game";
import { deleteMatch, type LoadResults } from "@/data/game/persistence";
import PhPlayFill from "../icons/PhPlayFill.vue";
import PhDotsThreeOutlineFill from "../icons/PhDotsThreeOutlineFill.vue";
import { ref } from "vue";
import PhXBold from "../icons/PhXBold.vue";

const props = defineProps<{
  save: LoadResults<GameState>;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const moreActionsExpanded = ref(false);

const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

function handleDelete() {
  // TODO: Don't delete when the three dots button is clicked, that should open
  // a menu with a delete button inside.
  deleteMatch(props.save.uuid);
  emit("deleted");
}
</script>

<template>
  <div
    class="save"
    :class="{ corrupted: save.error, expanded: moreActionsExpanded }"
  >
    <div class="details">
      <p class="game">{{ save.game?.name ?? "Unknown game" }}</p>
      <p class="state" v-if="save.error">Corrupted save</p>
      <p class="state" v-else>
        {{ save.state.toDisplayString() }}
      </p>
      <p class="date">
        {{ formatter.format(save.datetime) }}
      </p>
    </div>
    <div class="actions">
      <template v-if="moreActionsExpanded">
        <button class="text-button" @click="handleDelete">
          <p>Delete</p>
        </button>
        <button class="circle-button" @click="moreActionsExpanded = false">
          <PhXBold></PhXBold>
        </button>
      </template>
      <template v-else>
        <RouterLink
          v-if="!save.error && save.state.isGameOver() === false"
          :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
          class="open circle-button"
        >
          <PhPlayFill></PhPlayFill
        ></RouterLink>
        <button @click="moreActionsExpanded = true" class="circle-button">
          <PhDotsThreeOutlineFill></PhDotsThreeOutlineFill>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.save {
  display: grid;
  grid-template-columns: 1fr 6rem;
  gap: 1rem;
  align-items: center;

  // For the actions.
  position: relative;

  .game {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .state {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-strong);
    margin-bottom: 0.75rem;
  }
  &.corrupted .state {
    color: var(--color-error);
  }

  .date {
    font-size: 1rem;
  }

  &.expanded .actions {
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-background) 1.5rem
    );
    padding-left: 2rem;
  }

  .actions {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;

    @include template.row;
    gap: 1rem;

    .circle-button {
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
    .text-button {
      @include template.button-filled-neutral;
      --button-rounding: 1.25rem;
      height: 2.5rem;
      padding: 0 1rem;
      align-items: center;
      justify-content: center;

      p {
        font-size: 1rem;
        font-weight: bold;
        color: var(--color-text-strong);
      }
    }
  }
}
</style>
