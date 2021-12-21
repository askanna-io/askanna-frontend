<template>
  <job-run-log />
</template>

<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { onBeforeMount } from '@vue/composition-api'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunLog from '@/features/jobrun/components/jobrun/JobRunLog.vue'

const { route } = useRouter()
const jobRunStore = useJobRunStore()

const fetchData = async () => {
  const { jobRunId } = route.value.params

  if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
    await jobRunStore.resetStore()
    await jobRunStore.getJobRun(jobRunId)
  }
}

onBeforeMount(() => fetchData())
</script>
