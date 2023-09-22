<template>
  <VTabs
    v-model="currentRunTab"
    :show-arrows="!$vuetify.display.xs || !isMobilePlatform"
  >
    <VTab
      v-for="(tab, index) of  tabs "
      ripple
      :key="tab.id"
      :to="{
        name: tab.to,
        params: { ...params }
      }
        "
    >
      {{ tab.name }}
    </VTab>
  </VTabs>
</template>
<script setup lang="ts">
defineProps({
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
        suuid: '',
        description: ''
      }
    }
  }
})

const { route } = useRouterAskAnna()

const currentRunTab = ref('workspace-project-jobs-job-run-input')
const params = computed(() => route.params)

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})

const runIdTabs = [
  {
    id: 0,
    show: true,
    name: 'Overview',
    to: 'workspace-project-jobs-job-run-overview'
  },
  {
    id: 1,
    show: true,
    name: 'Input',
    to: 'workspace-project-jobs-job-run-input'
  },
  {
    id: 2,
    show: true,
    name: 'Result',
    to: 'workspace-project-jobs-job-run-result'
  },
  {
    id: 3,
    show: true,
    name: 'Metrics',
    to: 'workspace-project-jobs-job-run-metrics'
  },
  {
    id: 4,
    show: true,
    name: 'Artifact',
    to: 'workspace-project-jobs-job-run-artifact'
  },
  {
    id: 5,
    show: true,
    name: 'Variables',
    to: 'workspace-project-jobs-job-run-variables'
  },
  {
    id: 6,
    show: true,
    name: 'Code',
    to: 'workspace-project-jobs-job-run-code'
  },
  {
    id: 7,
    show: true,
    name: 'Log',
    to: 'workspace-project-jobs-job-run-log'
  }
]

const tabs = computed(() => runIdTabs.filter(item => item.show))
</script>
