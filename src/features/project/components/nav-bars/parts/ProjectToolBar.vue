<template>
  <div>
    <v-card-title transition="slide-y-transition">
      <span class="font-weight-light">Project: {{ projectName }}</span>
    </v-card-title>
    <project-menu :projectName="projectName" />
  </div>
</template>
<script setup lang="ts">
import ProjectMenu from './ProjectMenu.vue'

defineProps({
  projectName: {
    type: String,
    default: ''
  }
})
</script>
