<template>
  <v-card class="mx-auto" flat>
    JobTokens
  </v-card>
</template>

<script>
import { onBeforeMount, defineComponent } from '@vue/composition-api'
import useJobStore from '../composition/useJobStore'

export default defineComponent({
  name: 'JobTokens',

  setup(rops, context) {
    const jobStore = useJobStore()

    onBeforeMount(() => {
      jobStore.resetStore()
      const { jobId } = context.root.$route.params

      jobStore.getJob(jobId)
    })

    return {
      ...jobStore
    }
  }
})
</script>
