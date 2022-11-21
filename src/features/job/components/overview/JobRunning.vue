<template>
  <AskAnnaCard class="mx-auto" flat>
    <AskAnnaCardTitle :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }">Running the job</AskAnnaCardTitle>
    <AskAnnaRow>
      <AskAnnaCol cols="12" :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
        <AskAnnaToolbar dense color="white" class="br-r5" flat transition="slide-y-transition">
          <VTabs v-model="currentTab" left :align-with-title="!$vuetify.breakpoint.xsOnly">
            <VTabsSlider color="primary" />
            <template v-for="tab of tabs">
              <VTab ripple :key="tab.id">
                {{ tab.name }}
              </VTab>
            </template>
          </VTabs>
        </AskAnnaToolbar>
      </AskAnnaCol>
      <AskAnnaCol cols="12" :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
        <VTabsItems v-model="currentTab">
          <template v-for="tab in tabs">
            <VTabItem :key="tab.id">
              <Component :is="tab.component" />
            </VTabItem>
          </template>
        </VTabsItems>
      </AskAnnaCol>
    </AskAnnaRow>
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
