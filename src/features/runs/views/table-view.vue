<template>
  <v-card class="mx-auto" flat>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
      <runs
        :items="runs"
        :count="count"
        :itemsPerPage="25"
        :loading="runsLoading"
        :tableClass="'job-sub-table'"
        @onChangeParams="handleChangeParams"
      />
    </AskAnnaLoadingProgress>
  </v-card>
</template>

<script setup lang="ts">
import { useRunsStore } from '@/features/runs/useRunsStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, onBeforeMount, computed } from '@vue/composition-api'

import Runs from '@/features/runs/components/Runs.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const runsStore = useRunsStore()
const { route } = useRouterAskAnna()

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
