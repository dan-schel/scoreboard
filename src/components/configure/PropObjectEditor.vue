<script setup lang="ts">
import {
  PropObject,
  type PropObjectValue,
} from "@/data/game/config/prop-object";
import PropEditor from "./PropEditor.vue";

defineProps<{
  prop: PropObject;
  value: PropObjectValue;
  nestLevel: number;
}>();

defineEmits<{
  (e: "change", newValue: PropObjectValue): void;
}>();
</script>

<template>
  <div class="container" :class="{ inset: nestLevel != 0 }">
    <div class="fields">
      <div class="field" v-for="field in prop.fields" :key="field.key">
        <p class="field-name">{{ field.displayString }}:</p>
        <PropEditor
          :prop="field.prop"
          :value="value.require(field.key)"
          @change="
            (newValue) => $emit('change', value.withField(field.key, newValue))
          "
          :nest-level="nestLevel + 1"
        ></PropEditor>
      </div>
    </div>
    <p class="error" v-if="value.error != null">{{ value.error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.container {
  gap: 2rem;
}

.fields {
  gap: 1.5rem;
}

.field {
  gap: 0.5rem;
}

.field-name {
  font-weight: bold;
  color: var(--color-text-strong);
}

.error {
  color: var(--color-error);
  font-weight: bold;
}

.container.inset {
  gap: 1rem;

  .fields {
    padding-left: 1rem;
    border-left: 2px solid var(--color-soft-border);
  }
}
</style>
