<template>
  <div class="page-centerer">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css-template/import" as template;

.page-centerer {
  @include template.page-centerer;
  flex-grow: 1;
}
.content {
  width: 100%;
  flex-grow: 1;
}
</style>
