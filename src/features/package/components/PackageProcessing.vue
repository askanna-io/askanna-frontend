<template>
  <v-card flat class="pa-2 text-center">
    <AskAnnaLoadingProgress :loading="true" fullWidth loadingTitle="AskAnna is processing the package!" />
  </v-card>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

export default defineComponent({
  name: 'PackageProcessing'
})
</script>
