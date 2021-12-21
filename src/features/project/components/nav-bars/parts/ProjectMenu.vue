<template>
  <v-tabs class="pb-3" :class="{ 'pl-4': $vuetify.breakpoint.xsOnly }">
    <template v-for="tab of tabs">
      <v-tab
        v-if="tab.show"
        ripple
        :key="tab.id"
        @click="handleClick(tab.handler)"
        :to="{ name: tab.to, params: { title: `${tab.name} - ${projectName}`, ...routeParams, ...tab.params } }"
      >
        {{ tab.name }}
      </v-tab>
    </template>
  </v-tabs>
</template>
<script setup lang="ts">
import { invoke } from 'lodash'
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useProjectStore from '@/features/project/composition/useProjectStore'
import usePackageStore from '@/features/package/composition/usePackageStore'

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
const { route } = useRouter()
const permission = usePermission()
const packageStore = usePackageStore()
const projectStore = useProjectStore()

const projectJobList = computed(() => permission.getFor(permission.labels.projectJobList))
const projectCodeList = computed(() => permission.getFor(permission.labels.projectCodeList))
const projectVariableList = computed(() => permission.getFor(permission.labels.projectVariableList))

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
    id: 0,
    name: 'Activity',
    to: 'workspace-project-activity',
    show: false
  },
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
    name: 'Jobs',
    to: 'workspace-project-jobs',
    show: projectJobList.value
  },

  {
    id: 3,
    name: 'Variables',
    to: 'workspace-project-variables',
    show: projectVariableList.value
  },

  {
    id: 4,
    name: 'Documentation',
    to: 'workspace-project-documentation',
    show: false
  }
])

const projectId = computed(() => projectStore.project.value.short_uuid)
const packageId = computed(() => projectStore.project.value.package.short_uuid)
const routeParams = computed(() => ({
  ...route.value.params,
  projectId: projectId.value || route.value.params.projectId,
  packageId: packageId.value
}))

const tabs = computed(() => {
  const currentTabs = props.isEditProjectView ? projectEditTabs.value : projectTabs.value
  return currentTabs.filter(item => item.show)
})

const handlers = {
  getProject: async () => {
    if (!projectId.value) return
    await projectStore.getProject(route.value.params.projectId)

    if (!packageId.value) return
    await packageStore.getPackage({
      loading: true,
      projectId: projectId.value,
      packageId: packageId.value
    })
  }
}

const handleClick = (handler: string) => invoke(handlers, handler)
</script>
