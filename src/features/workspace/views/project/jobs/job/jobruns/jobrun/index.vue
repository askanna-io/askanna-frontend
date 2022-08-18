<template>
  <router-view />
</template>

<script lang="ts">
import { useJobStore } from '@/features/job/useJobStore'
import useInterval from '@/core/composition/useInterval'
import { useJobsStore } from '@/features/jobs/useJobsStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { computed, watchEffect, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const jobStore = useJobStore()
    const jobsStore = useJobsStore()
    const jobRunStore = useJobRunStore()

    const { isSet, setIntervalFn, clearIntervalFn } = useInterval()

    const jobRunStatus = computed(() => jobStore.run.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')

    const checkStatus = () => {
      if (isSet('checkStatus')) return
      setIntervalFn('checkStatus', async () => {
        const { jobRunId } = context.root.$route.params

        await jobStore.getJobRunStatus(jobRunId)
        if (isFinished.value) {
          await jobRunStore.actions.getJobRun(jobRunId)
          clearIntervalFn('checkStatus')
        }
      })
    }

    const fetchData = async () => {
      const { jobId, projectId, jobRunId } = context.root.$route.params

      if (jobStore.job.short_uuid !== jobId) {
        await jobsStore.$reset()
        await jobsStore.getProjectJobs(projectId)

        await jobStore.getJob(jobId)
      }
      await jobRunStore.actions.getJobRun(jobRunId)
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
