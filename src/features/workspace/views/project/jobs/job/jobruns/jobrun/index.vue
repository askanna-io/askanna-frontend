<template>
  <router-view />
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useProjectStore from '@project/composition/useProjectStore'
import { ref, computed, defineComponent, onUnmounted, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    const { jobId, projectId, jobRunId } = context.root.$route.params

    const polling = ref(null)

    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')

    const checkStatus = () => {
      polling.value = setInterval(async () => {
        await jobStore.getJobRunStatus(jobRunId)
        if (isFinished.value) {
          clearInterval(polling.value)
          await jobRunStore.getJobRun(jobRunId)
        }
      }, 5000)
    }
    const fetchData = async () => {
      if (jobStore.job.value.short_uuid !== jobId) {
        await projectStore.resetProjectJobs()
        await projectStore.getProjectJobs(projectId)

        await jobStore.getJob(jobId)
      }

      await jobRunStore.getJobRun(jobRunId)
      await jobStore.getJobRunStatus(jobRunId)
    }

    onBeforeMount(() => {
      fetchData()
      checkStatus()
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })
  }
})
</script>
