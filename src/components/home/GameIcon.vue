<script setup lang="ts">
import PhDiceThreeBold from "../icons/PhDiceThreeBold.vue";
import PhNumberSquareFourFill from "../icons/PhNumberSquareFourFill.vue";
import PhTennisBallFill from "../icons/PhTennisBallFill.vue";

defineProps<{
  id: string;
}>();
</script>

<template>
  <PhNumberSquareFourFill v-if="id == 'basic'"></PhNumberSquareFourFill>
  <PhTennisBallFill v-else-if="id == 'tennis'"></PhTennisBallFill>
  <PhDiceThreeBold v-else></PhDiceThreeBold>
</template>
