<template>
  <VTabs
    class="pb-3"
    :show-arrows="!$vuetify.breakpoint.xsOnly"
  >
    <template v-for="tab of tabs">
      <VTab
        v-if="tab.show"
        ripple
        :key="tab.id"
        @click="handleClick(tab.handler)"
        :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}`, ...routeParams, ...tab.params } }"
      >
        {{ tab.name }}
      </VTab>
    </template>
  </VTabs>
</template>
<script setup lang="ts">
import { invoke } from 'lodash'

const props = defineProps({
  projectName: {
    type: String,
    default: ''
  },
  isEditProjectView: {
    type: Boolean,
    default: false
  }
})
const permission = usePermission()
const { route } = useRouterAskAnna()
const packageStore = usePackageStore()
const projectStore = useProjectStore()

const variableList = computed(() => permission.getFor(permission.labels.variableList))
const projectJobList = computed(() => permission.getFor(permission.labels.projectJobList))
const projectCodeList = computed(() => permission.getFor(permission.labels.projectCodeList))
const projectRunList = computed(() => permission.getFor(permission.labels.projectRunList))


const projectEditTabs = computed(() => [
  {
    id: 0,
    name: 'Edit project',
    to: 'workspace-project-edit',
    show: true
  }
])

const projectTabs = computed(() => [
  {
    id: 1,
    name: 'Code',
    to: 'workspace-project-code',
    show: projectCodeList.value,
    params: { folderName: '' },
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
const packageId = computed(() => packageStore.packageData?.suuid)
const routeParams = computed(() => ({
  ...route.params,
  projectId: projectId.value || route.params.projectId,
  packageId: packageId.value
}))

const tabs = computed(() => {
  const currentTabs = props.isEditProjectView ? projectEditTabs.value : projectTabs.value
  return currentTabs.filter(item => item.show)
})

const handlers = {
  getProject: async () => {
    if (!projectId.value) return
    await projectStore.getProject(route.params.projectId)
  }
}

const handleClick = (handler: string) => invoke(handlers, handler)
</script>
