<script setup lang="ts">
import { PropInteger, PropIntegerValue } from "@/data/game/config/prop-integer";

defineProps<{
  prop: PropInteger;
  value: PropIntegerValue;
}>();

defineEmits<{
  (e: "change", newValue: PropIntegerValue): void;
}>();
</script>

<template>
  <input
    type="text"
    :value="value.textValue"
    @change="(e) => $emit('change', value.withValue((e.target as any).value))"
  />
  <p>{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
