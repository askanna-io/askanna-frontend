<template>
  <div>
    <v-card-title transition="slide-y-transition">
      <span class="font-weight-light">Project: {{ projectName }}</span>
    </v-card-title>
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
