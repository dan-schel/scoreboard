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
  --viewport-width: 70rem;
  --viewport-height: 35rem;
  --scale: 0.7;

  width: var(--viewport-width);
  height: var(--viewport-height);
  border: 1px solid var(--color-ink-20);
  overflow: hidden;
}

.content {
  transform: translate(-50%, -50%) scale(var(--scale)) translate(50%, 50%);
  width: calc(var(--viewport-width) / var(--scale));
  height: calc(var(--viewport-height) / var(--scale));
}
</style>
