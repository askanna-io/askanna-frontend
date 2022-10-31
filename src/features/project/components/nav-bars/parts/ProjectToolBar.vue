<template>
  <div>
    <AskAnnaCardTitle transition="slide-y-transition">
      <span class="font-weight-light">Project: {{ projectName }}</span>
    </AskAnnaCardTitle>
    <ProjectMenu :projectName="projectName" />
  </div>
</template>
<script setup lang="ts">
defineProps({
  projectName: {
    type: String,
    default: ''
  }
})
</script>
