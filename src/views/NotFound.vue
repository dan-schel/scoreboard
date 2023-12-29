<script setup lang="ts">
import { RouterLink } from "vue-router";

// TODO: Add your code here.
</script>

<template>
  <main>
    <h1>Error 404 - Page not found</h1>
    <p>This page doesn&apos;t exist, at least not anymore!</p>
    <p>
      <RouterLink class="link" :to="{ name: 'home' }">
        Here&apos;s a link to the homepage.
      </RouterLink>
    </p>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

main {
  padding: 2rem;
  height: 100vh;
  height: 100svh;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-ink-100);
  }
  * {
    text-align: center;
  }
}
</style>
