<template>
  <div class="list" :class="cssClasses">
    <slot name="title" />
    <ul class="list__items">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  sticky: {
    type: Boolean,
    default: () => false
  },
  dashed: {
    type: Boolean,
    default: () => false
  }
})

const cssClasses = computed(() => ({
  'list__items--sticky': props.sticky,
  'list--border-dashed': props.dashed
}))
</script>
<style scoped lang="scss">
.list {
  position: relative;
  display: flex;
  white-space: nowrap;
  align-items: stretch;
  margin-bottom: 15px;

  &--border-dashed {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
  }

  &.labels {
    margin-bottom: 9px;
  }

  &__items {
    display: flex;
    list-style: none;
    width: 10000px;
    flex-wrap: nowrap;
    column-gap: 20px;
    align-items: center;

    .vue-sticky-el & {
      background-color: white;
    }
  }

  &__items--sticky {
    width: auto;
    left: 60px;
    position: sticky;
  }
}
</style>
