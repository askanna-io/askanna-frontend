<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from '@vue/composition-api'
import { useFileStore } from '@/features/file/useFileStore'
import { useJobStore } from '@/features/job/useJobStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'

const jobStore = useJobStore()
const fileStore = useFileStore()
const jobRunStore = useJobRunStore()
const { route } = useRouterAskAnna()

const { jobId } = route.value.params

onBeforeMount(() => {
  const fetchData = async () => {
    await fileStore.$reset()
    await jobStore.$reset()
    await jobRunStore.actions.resetStore()
    await jobStore.getJob(jobId)
  }

  fetchData()
})
</script>
