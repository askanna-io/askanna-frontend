<template>
  <router-view />
</template>

<script lang="ts">
import { useJobStore } from '@/features/job/useJobStore'
import useInterval from '@/core/composition/useInterval'
import { useRunStore } from '@/features/run/useRunStore'
import { useJobsStore } from '@/features/jobs/useJobsStore'
import { computed, watchEffect, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  setup(_, context) {
    const jobStore = useJobStore()
    const runStore = useRunStore()
    const jobsStore = useJobsStore()

    const { isSet, setIntervalFn, clearIntervalFn } = useInterval()

    const runIdStatus = computed(() => jobStore.run.status)
    const isFinished = computed(() => runIdStatus.value === 'failed' || runIdStatus.value === 'finished')

    const checkStatus = () => {
      if (isSet('checkStatus')) return
      setIntervalFn('checkStatus', async () => {
        const { runId } = context.root.$route.params

        await jobStore.getRunStatus(runId)
        if (isFinished.value) {
          await runStore.getRun(runId)
          clearIntervalFn('checkStatus')
        }
      })
    }

    const fetchData = async () => {
      const { jobId, projectId, runId } = context.root.$route.params

      if (jobStore.job.short_uuid !== jobId) {
        await jobsStore.$reset()
        await jobsStore.getProjectJobs(projectId)

        await jobStore.getJob(jobId)
      }
      await runStore.getRun(runId)
      await jobStore.getRunStatus(runId)
    }

    onBeforeMount(() => {
      fetchData()
    })

    const stopWatchRunStatus = watchEffect(() => {
      if (runIdStatus.value && !isFinished.value) {
        checkStatus()

        stopWatchRunStatus && stopWatchRunStatus()
      }
    })
  }
})
</script>
