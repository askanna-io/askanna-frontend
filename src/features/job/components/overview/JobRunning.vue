<template>
  <AskAnnaCard
    flat
    class="mx-auto"
  >
    <AskAnnaCardTitle
      class="pb-1"
      :class="{ 'pb-0': $vuetify.display.xs }"
    >Running the job</AskAnnaCardTitle>
    <AskAnnaToolbar
      flat
      color="white"
      class="mb-3 px-4"
      transition="slide-y-transition"
    >
      <VTabs
        left
        v-model="currentTab"
        :align-with-title="!$vuetify.display.xs"
      >
        <VTab
          v-for="tab of tabs"
          ripple
          :key="tab.id"
        >
          {{ tab.name }}
        </VTab>
      </VTabs>
    </AskAnnaToolbar>
    <VWindow v-model="currentTab">
      <VWindowItem
        v-for="tab in tabs"
        :key="tab.id"
      >
        <KeepAlive>
          <Suspense>
            <Component :is="tab.component" />
          </Suspense>
        </KeepAlive>
      </VWindowItem>
    </VWindow>
  </AskAnnaCard>
</template>

<script setup lang="ts">
import RunCurl from './run/RunCurl.vue'
import RunPython from './run/RunPython.vue'
import RunPlatform from './run/RunPlatform.vue'

const currentTab = ref('workspace-project-job-running-curl')

const tabs = [
  {
    id: 0,
    name: 'Platform',
    component: RunPlatform,
    to: 'workspace-project-job-running-platform'
  },
  {
    id: 1,
    name: 'CLI / CURL',
    component: RunCurl,
    to: 'workspace-project-job-running-curl'
  },
  {
    id: 2,
    name: 'Python',
    component: RunPython,
    to: 'workspace-project-job-running-python'
  }
]
</script>
