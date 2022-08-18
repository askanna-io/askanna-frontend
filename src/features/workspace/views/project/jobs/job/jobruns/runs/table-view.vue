<template>
  <v-card class="mx-auto" flat>
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <job-runs
        :items="runs"
        :count="count"
        :itemsPerPage="25"
        :loading="runsLoading"
        :tableClass="'job-sub-table'"
        @onChangeParams="handleChangeParams"
      />
    </ask-anna-loading-progress>
  </v-card>
</template>

<script setup lang="ts">
import { useRunsStore } from '@/features/runs/useRunsStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, onBeforeMount, computed } from '@vue/composition-api'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'

import JobRuns from '@/features/jobrun/components/JobRuns.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const { route } = useRouterAskAnna()
const jobRunStore = useJobRunStore()

const runsStore = useRunsStore()

const { jobId: uuid } = route.value.params

const loading = ref(true)

const fetchData = async () => {
  await runsStore.getRuns({
    uuid,
    params: {
      limit: 25,
      offset: 0
    }
  })

  loading.value = false
}

onBeforeMount(() => fetchData())

const count = computed(() => runsStore.runs.count)
const runs = computed(() => runsStore.runs.results)
const runsLoading = computed(() => runsStore.runsLoading)

const handleChangeParams = async params => {
  await runsStore.getRuns({
    uuid,
    params
  })
}
</script>
