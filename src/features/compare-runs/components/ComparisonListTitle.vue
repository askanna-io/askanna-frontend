<template>
  <div class="list__title" :class="{ 'font-weight-bold': bold, 'align-center': alignCenter }">
    {{ isSubItem ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '' }}<AskAnnaTextSliced :value="value" :maxLength="18" />
  </div>
</template>
<script setup lang="ts">
import AskAnnaTextSliced from '@/core/components/shared/AskAnnaTextSliced.vue'

const props = defineProps({
  value: {
    type: [String, Number],
    default: () => ''
  },
  bold: {
    type: Boolean,
    default: () => false
  },
  alignCenter: {
    type: Boolean,
    default: () => false
  },
  isSubItem: {
    type: Boolean,
    default: () => false
  }
})
</script>
<style lang="scss">
.list {
  &__title {
    display: flex;
    flex-basis: 100px;
    flex-shrink: 0;
    left: 0px;
    min-width: 160px;
    position: sticky;
    padding-left: 60px;
    align-items: center;
    z-index: 1;
    background-color: white;
    min-height: 30px;

    .top-sticky & {
      left: auto;
    }
  }
}
</style>
