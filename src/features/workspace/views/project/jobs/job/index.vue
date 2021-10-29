<template>
  <router-view />
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const { jobId } = context.root.$route.params

    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(() => {
      const fetchData = async () => {
        await jobStore.resetStore()
        await jobRunStore.resetStore()
        await jobStore.getJob(jobId)
      }

      fetchData()
    })
  }
})
</script>
