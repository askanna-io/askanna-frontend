<template>
  <div class="flex items-center justify-center p-8">
    <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <span
        v-for="(value, key) in AskAnnaLightTheme.colors"
        :key="key"
        :class="[`bg-${key}`]"
        class="inline-flex items-center h-8 rounded-sm px-2.5 py-0.5 text-sm font-medium text-white"
      >{{ key }}:
        {{ value }}
      </span>

    </div>
  </div>
</template>

<script setup lang="ts">
import { AskAnnaLightTheme } from '@/plugins/vuetify'
</script>