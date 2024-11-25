<script setup lang="ts">
import { fetchAllSavedMatches } from "@/data/game/persistence";
import { ref } from "vue";
import PhDotsThreeOutlineFill from "@/components/icons/PhDotsThreeOutlineFill.vue";
import PhPlayFill from "@/components/icons/PhPlayFill.vue";

const savedGames = ref(fetchAllSavedMatches());
const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});
</script>

<template>
  <div class="saves">
    <p v-if="savedGames.length == 0" class="empty">No saved games to load.</p>

    <template v-for="(save, i) in savedGames" :key="i">
      <div class="save" :class="{ corrupted: save.error }">
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
          <RouterLink
            v-if="!save.error && save.state.isGameOver() === false"
            :to="{ path: `/${save.game.id}/${save.instance.uuid}` }"
            class="open"
          >
            <PhPlayFill></PhPlayFill
          ></RouterLink>
          <button>
            <PhDotsThreeOutlineFill></PhDotsThreeOutlineFill>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.saves {
  gap: 2rem;
}

.empty {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-weak);
}

.save {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

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

  .actions {
    @include template.row;
    gap: 1rem;

    > * {
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
}
</style>
