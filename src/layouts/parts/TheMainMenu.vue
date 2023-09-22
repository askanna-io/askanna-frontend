<template>
  <div
    v-if="!$vuetify.display.xs"
    class="gap-2"
  >
    <TheWorkspacesMenu />
    <TheProjectsMenu />
  </div>
</template>

<script setup lang="ts">
import TheProjectsMenu from './TheProjectsMenu.vue'
import TheWorkspacesMenu from './TheWorkspacesMenu.vue'
</script>