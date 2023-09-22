<template>
  <div
    class="pb-5"
    :class="{ 'px-0 ': $vuetify.display.xs }"
  >
    <AskAnnaLoadingProgress
      fullWidth
      :loading="loading"
    >
      <AskAnnaCard flat>
        <AskAnnaCardTitle :class="{ 'pt-0': $vuetify.display.xs }">Information:</AskAnnaCardTitle>
        <RunInfo
          :run="run"
          :jobId="jobId"
          :jobName="jobName"
          :runIdStatus="runIdStatus"
          :loadingStatus="loadingStatus"
        />
        <template v-if="isDescriptionNotEmpty">
          <AskAnnaCardTitle class="mt-3">Description:</AskAnnaCardTitle>

          <AskAnnaDescription
            preview
            readonly
            class="mx-2 sm:mx-0"
            :description="description"
          />
        </template>
      </AskAnnaCard>
    </AskAnnaLoadingProgress>
  </div>
</template>

<script setup lang="ts">
const jobStore = useJobStore()
const runStore = useRunStore()
const { route } = useRouterAskAnna()

const { jobId } = route.params

const run = computed(() => runStore.run)
const runIdStatus = computed(() => runStore.run)
const jobName = computed(() => jobStore.job.name)
const loading = computed(() => runStore.runLoading)
const description = computed(() => runStore.run.description)
const loadingStatus = computed(() => runStore.runStatusLoading)
const isDescriptionNotEmpty = computed(() => description.value && description.value !== '<p></p>')
</script>
