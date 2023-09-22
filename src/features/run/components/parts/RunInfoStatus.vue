<template>
  <div class="group flex items-center">
    <template v-if="text"><span class="font-bold">{{ text }}: &nbsp;</span></template>
    <AskAnnaChipStatus :status="value" />
    <AskAnnaTooltip>
      Status of the run
    </AskAnnaTooltip>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  }
})
</script>
