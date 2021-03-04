<template>
  <v-card flat class="pa-2 text-center">
    <ask-anna-loading-progress :loading="true" fullWidth loadingTitle="AskAnna is processing the package!" />
  </v-card>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageProcessing'
})
</script>
