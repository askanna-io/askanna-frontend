<template>
  <div class="d-flex">
    <div v-if="isShowName">{{ metricRow.name }}: &nbsp;</div>
    <AskAnnaIcon small>mdi-record</AskAnnaIcon>
  </div>
</template>
<script setup lang="ts">
defineProps({
  isShowName: {
    type: Boolean,
    default: () => false
  },
  metricRow: {
    type: Object,
    default: function () {
      return {
        name: '',
        type: '',
        value: ''
      }
    }
  }
})
</script>
