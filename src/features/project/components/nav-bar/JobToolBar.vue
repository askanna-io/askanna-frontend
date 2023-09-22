<template>
  <VTabs
    show-arrows
    v-model="currentTab"
    :align-with-title="!$vuetify.display.xs"
  >
    <template v-for="tab of tabs">
      <VTab
        v-if="tab.show"
        :key="tab.id"
        :value="tab.id"
        ripple
        :to="{
          name: tab.to,
          query: tab?.query,
          params: { ...params },
          meta: { title: `${tab.name} - ${projectName}` }
        }"
      >
        {{ tab.name }}
      </VTab>
    </template>
  </VTabs>
</template>
<script setup lang="ts">
defineProps({
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

const currentTab = ref(1)
const params = computed(() => route.params)

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
    query: { page_size: 25 },
    to: 'workspace-project-jobs-job-runs-table'
  }
]
const tabs = computed(() => jobTools.filter(item => item.show))
</script>
