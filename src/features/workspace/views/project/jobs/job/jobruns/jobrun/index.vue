<template>
  <router-view />
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useFetchData from '@/core/composition/useFetchData'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useProjectStore from '@project/composition/useProjectStore'
import { defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  setup(props, context) {
    const jobStore = useJobStore()
    const fetchData = useFetchData()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    onBeforeMount(async () => {
      const { jobId, projectId } = context.root.$route.params

      if (jobStore.job.value.short_uuid !== jobId) {
        projectStore.resetProjectJobs()
        projectStore.getProjectJobs(projectId)

        jobStore.getJob(jobId)
      }
    })
  }
})
</script>
