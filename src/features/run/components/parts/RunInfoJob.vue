<template>
  <div class="d-flex align-baseline">
    <div class="text-body-1">
      <span class="font-weight-bold">{{ text }}:</span>
    </div>
    <AskAnnaButton
      color="primary"
      class="px-1 AskAnna-text--initial text-body-1"
      text
      x-small
      :to="{
        name: 'workspace-project-job-overiew',
        params: { ...$route.params }
      }"
    >
      {{ value }}</AskAnnaButton
    >
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
