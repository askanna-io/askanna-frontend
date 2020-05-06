<template>
  <v-card class="mx-auto" flat>asda </v-card>
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import { onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
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
  },

  data() {
    return {
      selection: 2
    }
  }
})
</script>
