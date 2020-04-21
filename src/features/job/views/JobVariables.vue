<template>
  <v-card class="mx-auto" flat>
    JobVariables
  </v-card>
</template>

<script>
import { onBeforeMount, defineComponent } from '@vue/composition-api'
import useJobStore from '../composition/useJobStore'

export default defineComponent({
  name: 'JobVariables',

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
