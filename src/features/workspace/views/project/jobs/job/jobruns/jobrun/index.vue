<template>
  <router-view />
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useInterval from '@/core/composition/useInterval'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useProjectStore from '@project/composition/useProjectStore'
import { computed, watchEffect, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    const { isSet, setIntervalFn, clearIntervalFn } = useInterval()

    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')

    const checkStatus = () => {
      if (isSet('checkStatus')) return
      setIntervalFn('checkStatus', async () => {
        const { jobRunId } = context.root.$route.params

        await jobStore.getJobRunStatus(jobRunId)
        if (isFinished.value) {
          await jobRunStore.getJobRun(jobRunId)
          clearIntervalFn('checkStatus')
        }
      })
    }

    const fetchData = async () => {
      const { jobId, projectId, jobRunId } = context.root.$route.params

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
    })

    const stopWatchRunStatus = watchEffect(() => {
      if (jobRunStatus.value && !isFinished.value) {
        checkStatus()

        stopWatchRunStatus && stopWatchRunStatus()
      }
    })
  }
})
</script>
