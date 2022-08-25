<template>
  <v-tooltip top content-class="opacity-1">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <template v-if="text"
          ><span class="font-weight-bold">{{ text }}: &nbsp;</span></template
        ><ask-anna-chip-status :status="value" />
      </div>
    </template>
    Status of the run
  </v-tooltip>
</template>

<script setup lang="ts">
import AskAnnaChipStatus from '@/core/components/shared/AskAnnaChipStatus.vue'
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
