<template>
  <VTabs
    v-model="tab"
    color="primary"
    :show-arrows="!$vuetify.display.xs || !isMobilePlatform"
  >
    <template v-for="tab of tabs">
      <VTab
        v-if="tab.show"
        ripple
        :key="tab.id"
        :value="tab.id"
        @click="handleClick(tab.handler)"
        :to="{
          name: tab.to,
          params: { ...routeParams, ...tab.params },
          meta: { title: `${tab.name} - ${projectName}` }
        }"
      >
        {{ tab.name }}
      </VTab>
    </template>
  </VTabs>
</template>
<script setup lang="ts">
import { invoke } from 'lodash'

defineProps({
  projectName: {
    type: String,
    default: ''
  },
  isEditProjectView: {
    type: Boolean,
    default: false
  }
})
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const permission = useAskAnnaPermission()

const tab = ref(1)

const variableList = computed(() => permission.getFor(permission.labels.variableList))
const projectRunList = computed(() => permission.getFor(permission.labels.projectRunList))
const projectJobList = computed(() => permission.getFor(permission.labels.projectJobList))
const projectCodeList = computed(() => permission.getFor(permission.labels.projectCodeList))

const projectTabs = computed(() => [
  {
    id: 1,
    name: 'Code',
    to: 'workspace-project-code',
    show: projectCodeList.value,
    handler: 'getProject'
  },
  {
    id: 2,
    name: 'Runs',
    to: 'workspace-project-runs',
    show: projectRunList.value
  },
  {
    id: 3,
    name: 'Jobs',
    to: 'workspace-project-jobs',
    show: projectJobList.value
  },
  {
    id: 4,
    name: 'Variables',
    to: 'workspace-project-variables',
    show: variableList.value
  }
])

const projectId = computed(() => projectStore.project.suuid)
const routeParams = computed(() => ({
  workspaceId: route.params.workspaceId,
  projectId: projectId.value || route.params.projectId,
}))

const tabs = computed(() => projectTabs.value.filter(item => item.show))

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})

const handlers = {
  getProject: async () => {
    if (!projectId.value) return
    await projectStore.getProject(route.params.projectId)
  }
}

const handleClick = (handler: string) => invoke(handlers, handler)
</script>

<style lang="scss">
.v-tab--selected {
  @apply text-primary;
}
</style>