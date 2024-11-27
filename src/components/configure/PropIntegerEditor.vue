<script setup lang="ts">
import { PropInteger, PropIntegerValue } from "@/data/game/config/prop-integer";

defineProps<{
  prop: PropInteger;
  value: PropIntegerValue;
}>();

defineEmits<{
  (e: "change", newValue: PropIntegerValue): void;
}>();

// TODO: If we want to, we could validate the prop on blur.
// Just call the change event with `prop.validate(value)` as the new value, and
// then the error message should be displayed.
</script>

<template>
  <input
    type="text"
    :value="value.textValue"
    @change="(e) => $emit('change', value.withValue((e.target as any).value))"
  />
  <p class="error" v-if="value.error != null">{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

input[type="text"] {
  @include template.input-filled-neutral;
  padding: 0.5rem 0.75rem;
  max-width: 8rem;
  font-size: 1.5rem;
}

.error {
  color: var(--color-error);
  font-weight: bold;
}
</style>
