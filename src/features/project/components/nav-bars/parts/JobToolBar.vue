<template>
  <AskAnnaFlex>
    <AskAnnaCardTitle v-if="showTitle">
      <span class="title font-weight-light">Job: {{ jobName }}</span>
    </AskAnnaCardTitle>

    <v-tabs v-model="currentTab" show-arrows :align-with-title="!$vuetify.breakpoint.xsOnly">
      <v-tabs-slider color="primary" />
      <template v-for="tab of tabs">
        <v-tab
          v-if="tab.show"
          :key="tab.id"
          exact
          ripple
          :to="{ name: tab.to, params: { ...params, title: `${tab.name} - ${projectName}` } }"
        >
          {{ tab.name }}
        </v-tab>
      </template>
    </v-tabs>
  </AskAnnaFlex>
</template>
<script setup lang="ts">
const props = defineProps({
  projectName: {
    type: String,
    default: ''
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  jobName: {
    type: String,
    default: ''
  },
  isEditJobView: {
    type: Boolean,
    default: false
  }
})

const { route } = useRouterAskAnna()

const currentTab = ref('job-overview')
const params = computed(() => route.params)

const runIdEditTabs = [
  {
    id: 0,
    name: 'Edit job',
    show: true,
    to: 'workspace-project-job-edit'
  }
]

const jobTools = [
  {
    id: 0,
    name: 'Overview',
    show: true,
    to: 'workspace-project-job-overiew'
  },
  {
    id: 1,
    name: 'Runs',
    show: true,
    to: 'workspace-project-jobs-job-runs-table'
  }
]

const tabs = computed(() => {
  const runTabs = props.isEditJobView ? runIdEditTabs : jobTools

  return runTabs.filter(item => item.show)
})
</script>
