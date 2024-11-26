<script setup lang="ts">
import { PropInteger } from "@/data/game/config/prop-integer";
import {
  PropObject,
  type PropObjectValue,
} from "@/data/game/config/prop-object";
import PropIntegerEditor from "./PropIntegerEditor.vue";
import PropArrayEditor from "./PropArrayEditor.vue";
import { PropArray } from "@/data/game/config/prop-array";

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
    <PropObjectEditor
      v-if="field.prop instanceof PropObject"
      :prop="field.prop"
      :value="value.requireObject(field.key)"
      @change="
        (newValue) => $emit('change', value.withField(field.key, newValue))
      "
    ></PropObjectEditor>
    <PropArrayEditor
      v-if="field.prop instanceof PropArray"
      :prop="field.prop"
      :value="value.requireArray(field.key)"
      @change="
        (newValue) => $emit('change', value.withField(field.key, newValue))
      "
    ></PropArrayEditor>
    <PropIntegerEditor
      v-if="field.prop instanceof PropInteger"
      :prop="field.prop"
      :value="value.requireInteger(field.key)"
      @change="
        (newValue) => $emit('change', value.withField(field.key, newValue))
      "
    ></PropIntegerEditor>
  </template>
  <p>{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
