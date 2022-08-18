<template>
  <span>{{ get(triggers, value) || value }}</span>
</template>
<script setup lang="ts">
import { get } from 'lodash'

defineProps({
  value: {
    type: [String, Number],
    default: () => ''
  }
})

const triggers = {
  API: 'API',
  CLI: 'CLI',
  WORKER: 'Worker',
  SCHEDULE: 'Schedule',
  WEBUI: 'Web interface',
  'PYTHON-SDK': 'Python SDK'
}
</script>
