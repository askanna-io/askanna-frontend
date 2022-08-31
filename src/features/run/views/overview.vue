<template>
  <div class="pb-5" :class="{ 'px-0 ': $vuetify.breakpoint.xsOnly, 'px-4': !$vuetify.breakpoint.xsOnly }">
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-card-title :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">Information:</v-card-title>
        <run-info
          :jobId="jobId"
          :run="run"
          :jobName="jobName"
          :runIdStatus="runIdStatus"
          :loadingStatus="loadingStatus"
        />
        <template v-if="isDescriptionNotEmpty">
          <v-card-title class="mt-3">Description:</v-card-title>

          <ask-anna-description class="px-2" preview readonly :description="description" />
        </template>
      </v-card>
    </AskAnnaLoadingProgress>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import { useJobStore } from '@/features/job/useJobStore'
import { useRunStore } from '@/features/run/useRunStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import RunInfo from '@/features/run/components/RunInfo.vue'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const jobStore = useJobStore()
const runStore = useRunStore()
const { route } = useRouterAskAnna()

const { jobId, runId } = route.value.params

const jobName = computed(() => jobStore.job.name)
const runIdStatus = computed(() => jobStore.run)
const loadingStatus = computed(() => jobStore.runStatusLoading)

const run = computed(() => runStore.run)
const loading = computed(() => runStore.runLoading)

const description = computed(() => runStore.run.description)
const isDescriptionNotEmpty = computed(() => description.value && description.value !== '<p></p>')

const fetchData = async () => {
  await jobStore.getRunStatus(runId)
}

fetchData()
</script>
