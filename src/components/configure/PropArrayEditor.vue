<script setup lang="ts">
import { PropInteger } from "@/data/game/config/prop-integer";
import { PropObject } from "@/data/game/config/prop-object";
import PropIntegerEditor from "./PropIntegerEditor.vue";
import PropObjectEditor from "./PropObjectEditor.vue";
import { PropArray, type PropArrayValue } from "@/data/game/config/prop-array";

defineProps<{
  prop: PropArray;
  value: PropArrayValue;
}>();

defineEmits<{
  (e: "change", newValue: PropArrayValue): void;
}>();
</script>

<template>
  <template v-for="(item, i) in value.items" :key="i">
    <!-- 
      TODO: This is the last place PropValue.item is used, but we could use 
      prop.propByIndex instead. It will become pretty annoying to call multiple 
      times though, so it's probably worth extracting this inner piece as a 
      separate Vue component and use computed(). That way we can also share the 
      switching logic with PropObjectEditor! 
    -->
    <PropObjectEditor
      v-if="item.prop instanceof PropObject"
      :prop="item.prop"
      :value="value.requireObject(i)"
      @change="(newValue) => $emit('change', value.withElement(i, newValue))"
    ></PropObjectEditor>
    <PropArrayEditor
      v-if="item.prop instanceof PropArray"
      :prop="item.prop"
      :value="value.requireArray(i)"
      @change="(newValue) => $emit('change', value.withElement(i, newValue))"
    ></PropArrayEditor>
    <PropIntegerEditor
      v-if="item.prop instanceof PropInteger"
      :prop="item.prop"
      :value="value.requireInteger(i)"
      @change="(newValue) => $emit('change', value.withElement(i, newValue))"
    ></PropIntegerEditor>
  </template>
  <p>{{ value.error }}</p>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

// TODO: Add your code here.
</style>
