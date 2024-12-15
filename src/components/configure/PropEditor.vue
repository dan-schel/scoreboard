<script setup lang="ts">
import type { Prop, PropValue } from "@/data/game/config/prop";
import PropIntegerEditor from "./PropIntegerEditor.vue";
import PropArrayEditor from "./PropArrayEditor.vue";
import PropObjectEditor from "./PropObjectEditor.vue";
import { PropObject, PropObjectValue } from "@/data/game/config/prop-object";
import { PropArray, PropArrayValue } from "@/data/game/config/prop-array";
import { PropInteger, PropIntegerValue } from "@/data/game/config/prop-integer";
import { PropEnum, PropEnumValue } from "@/data/game/config/prop-enum";
import PropEnumEditor from "./PropEnumEditor.vue";

defineProps<{
  prop: Prop<PropValue>;
  value: PropValue;
  nestLevel: number;
}>();

defineEmits<{
  (e: "change", newValue: PropValue): void;
}>();
</script>

<template>
  <PropObjectEditor
    v-if="prop instanceof PropObject && value instanceof PropObjectValue"
    :prop="prop"
    :value="value"
    @change="(newValue) => $emit('change', newValue)"
    :nest-level="nestLevel"
  ></PropObjectEditor>
  <PropArrayEditor
    v-else-if="prop instanceof PropArray && value instanceof PropArrayValue"
    :prop="prop"
    :value="value"
    @change="(newValue) => $emit('change', newValue)"
    :nest-level="nestLevel"
  ></PropArrayEditor>
  <PropIntegerEditor
    v-else-if="prop instanceof PropInteger && value instanceof PropIntegerValue"
    :prop="prop"
    :value="value"
    @change="(newValue) => $emit('change', newValue)"
  ></PropIntegerEditor>
  <PropEnumEditor
    v-else-if="prop instanceof PropEnum && value instanceof PropEnumValue"
    :prop="prop"
    :value="value"
    @change="(newValue) => $emit('change', newValue)"
  ></PropEnumEditor>
  <p v-else>Error: Unhandled prop type.</p>
</template>
