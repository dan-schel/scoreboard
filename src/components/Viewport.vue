<script setup lang="ts">
// TODO: Add your code here.
</script>

<template>
  <div class="viewport-container">
    <div class="viewport">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.viewport-container {
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

.viewport {
  --viewport-width: 60rem;
  --viewport-height: 30rem;
  --scale: 0.6;

  width: var(--viewport-width);
  height: var(--viewport-height);
  border: 1px solid white;
}

.content {
  transform: translate(-50%, -50%) scale(var(--scale)) translate(50%, 50%);
  width: calc(var(--viewport-width) / var(--scale));
  height: calc(var(--viewport-height) / var(--scale));
}
</style>
