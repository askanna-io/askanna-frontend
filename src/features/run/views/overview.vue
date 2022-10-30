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
const jobStore = useJobStore()
const runStore = useRunStore()
const { route } = useRouterAskAnna()

const { jobId, runId } = route.params

const run = computed(() => runStore.run)
const runIdStatus = computed(() => runStore.run)
const jobName = computed(() => jobStore.job.name)
const loading = computed(() => runStore.runLoading)
const description = computed(() => runStore.run.description)
const loadingStatus = computed(() => runStore.runStatusLoading)
const isDescriptionNotEmpty = computed(() => description.value && description.value !== '<p></p>')

const fetchData = async () => await runStore.getRunStatus(runId)

fetchData()
</script>
