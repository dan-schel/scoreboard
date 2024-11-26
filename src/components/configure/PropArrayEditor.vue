<script setup lang="ts">
import { PropArray, type PropArrayValue } from "@/data/game/config/prop-array";
import PropEditor from "./PropEditor.vue";

defineProps<{
  prop: PropArray;
  value: PropArrayValue;
  nestLevel: number;
}>();

defineEmits<{
  (e: "change", newValue: PropArrayValue): void;
}>();
</script>

<template>
  <template v-for="(item, i) in value.items" :key="i">
    <!-- TODO: Should I memoize these propByIndex calls?-->
    <PropEditor
      :prop="prop.propByIndex(i)"
      :value="item"
      @change="(newValue) => $emit('change', value.withElement(i, newValue))"
      :nest-level="nestLevel + 1"
    ></PropEditor>
  </template>
  <!-- 
    TODO: A button to add new values. (Also each value needs a delete button!)
  -->
  <p class="error" v-if="value.error != null">{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: I haven't done any styling here, since it's not used yet.

.error {
  color: var(--color-error);
  font-weight: bold;
}
</style>
