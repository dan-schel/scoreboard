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

  <p>{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
