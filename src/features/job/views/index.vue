<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from '@vue/composition-api'
import { useRunStore } from '@/features/run/useRunStore'
import { useJobStore } from '@/features/job/useJobStore'
import { useFileStore } from '@/features/file/useFileStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

const runStore = useRunStore()
const jobStore = useJobStore()
const fileStore = useFileStore()

const { route } = useRouterAskAnna()

const { jobId } = route.value.params

onBeforeMount(() => {
  const fetchData = async () => {
    await fileStore.$reset()
    await jobStore.$reset()
    await runStore.resetStore()
    await jobStore.getJob(jobId)
  }

  fetchData()
})
</script>
