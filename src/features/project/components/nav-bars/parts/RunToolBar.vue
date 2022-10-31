<template>
  <AskAnnaFlex>
    <AskAnnaCardTitle v-if="showTitle" :class="{ 'ml-0': $vuetify.breakpoint.xsOnly }">
      <span class="title font-weight-light">Run: #{{ runId }}</span>
    </AskAnnaCardTitle>

    <v-tabs v-model="currentRunTab" class="pb-3">
      <v-tab v-for="tab of tabs" ripple :key="tab.id" :to="{ name: tab.to, params: { ...params, folderName: '' } }">
        {{ tab.name }}
      </v-tab>
      <RunMenuPopup v-if="!isEditRunView && projectRunEdit && $vuetify.breakpoint.xsOnly" class="pt-2" />
    </v-tabs>
  </AskAnnaFlex>
</template>
<script setup lang="ts">
const props = defineProps({
  runId: {
    type: String,
    default: ''
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  isEditRunView: {
    type: Boolean,
    default: false
  },
  projectRunEdit: {
    type: Boolean,
    default: false
  },
  jobrun: {
    type: Object,
    default: function () {
      return {
        name: '',
        short_uuid: '',
        description: ''
      }
    }
  }
})

const { route } = useRouterAskAnna()

const currentRunTab = ref('workspace-project-jobs-job-run-input')

const params = computed(() => route.params)

const runIdEditTabs = [
  {
    id: 0,
    name: 'Edit run info',
    show: true,
    to: 'workspace-project-jobs-job-run-edit'
  }
]

const runIdTabs = [
  {
    id: 0,
    name: 'Overview',
    show: true,
    to: 'workspace-project-jobs-job-run-overview'
  },
  {
    id: 1,
    name: 'Input',
    show: true,
    to: 'workspace-project-jobs-job-run-input'
  },
  {
    id: 2,
    name: 'Result',
    show: true,
    to: 'workspace-project-jobs-job-run-result'
  },
  {
    id: 3,
    name: 'Metrics',
    show: true,
    to: 'workspace-project-jobs-job-run-metrics'
  },
  {
    id: 4,
    name: 'Artifact',
    show: true,
    to: 'workspace-project-jobs-job-run-artifact'
  },
  {
    id: 5,
    name: 'Variables',
    show: true,
    to: 'workspace-project-jobs-job-run-variables'
  },
  {
    id: 6,
    name: 'Code',
    show: true,
    to: 'workspace-project-jobs-job-run-code'
  },
  {
    id: 7,
    name: 'Log',
    show: true,
    to: 'workspace-project-jobs-job-run-log'
  }
]

const tabs = computed(() => {
  const runTabs = props.isEditRunView ? runIdEditTabs : runIdTabs
  return runTabs.filter(item => item.show)
})
</script>
