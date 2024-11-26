<script setup lang="ts">
import {
  PropObject,
  type PropObjectValue,
} from "@/data/game/config/prop-object";
import PropEditor from "./PropEditor.vue";

defineProps<{
  prop: PropObject;
  value: PropObjectValue;
}>();

defineEmits<{
  (e: "change", newValue: PropObjectValue): void;
}>();
</script>

<template>
  <template v-for="field in prop.fields" :key="field.key">
    <p>{{ field.displayString }}</p>
    <PropEditor
      :prop="field.prop"
      :value="value.require(field.key)"
      @change="
        (newValue) => $emit('change', value.withField(field.key, newValue))
      "
    ></PropEditor>
  </template>
  <p>{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
