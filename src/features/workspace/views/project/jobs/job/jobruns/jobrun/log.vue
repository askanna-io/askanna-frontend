<template>
  <job-run-log />
</template>

<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { onBeforeMount } from '@vue/composition-api'
import { useFileStore } from '@/features/file/useFileStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunLog from '@/features/jobrun/components/jobrun/JobRunLog.vue'

const { route } = useRouter()
const fileStore = useFileStore()
const jobRunStore = useJobRunStore()

const fetchData = async () => {
  fileStore.$reset()

  const { jobRunId } = route.value.params

  if (jobRunStore.state.jobRun.value.short_uuid !== jobRunId) {
    await jobRunStore.actions.resetStore()
    await jobRunStore.actions.getJobRun(jobRunId)
  }
}

onBeforeMount(() => fetchData())
</script>
