<template>
  <router-view />
</template>

<script lang="ts">
import { useFileStore } from '@/features/file/useFileStore'
import useJobStore from '@/features/job/composition/useJobStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const { jobId } = context.root.$route.params

    const jobStore = useJobStore()
    const fileStore = useFileStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(() => {
      const fetchData = async () => {
        fileStore.$reset()
        await jobStore.resetStore()
        await jobRunStore.actions.resetStore()
        await jobStore.getJob(jobId)
      }

      fetchData()
    })
  }
})
</script>
