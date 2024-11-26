<script setup lang="ts">
import type { PropEnum, PropEnumValue } from "@/data/game/config/prop-enum";

defineProps<{
  prop: PropEnum;
  value: PropEnumValue;
}>();

defineEmits<{
  (e: "change", newValue: PropEnumValue): void;
}>();
</script>

<template>
  <div class="select-wrapper">
    <select
      @change="(e) => $emit('change', value.withValue((e.target as any).value))"
    >
      <option
        v-for="option in prop.options"
        :key="option.value"
        :value="option.value"
        :selected="option.value === value.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="select-highlight">
      <div class="select-arrow"></div>
    </div>
  </div>

  <p class="error" v-if="value.error != null">{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.select-wrapper {
  @include template.select-filled-neutral(
    $highlight-class: "select-highlight",
    $arrow-class: "select-arrow"
  );
  max-width: 25rem;

  select {
    padding: 0.5rem 0.75rem;
  }
  .select-arrow {
    margin-right: 0.25rem;
  }
}

.error {
  color: var(--color-error);
  font-weight: bold;
}
</style>
