<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <v-card flat>
      <Project
        v-if="projectInfoEdit"
        :projectData="projectData"
        :saveButtonText="'Save my changes'"
        :projectTemplates="projectTemplates"
        :workspaceProjectVisibility="workspaceProjectVisibility"
        @handleCreate="handleUpdate"
        @handleCancel="handleCancel"
        @handleOnInput="handleOnInput"
      />
      <v-alert v-else class="mx-2 my-4 text-center" dense outlined>
        You are not allowed to edit this project. I can bring you back to the project
        <router-link :to="{ name: 'workspace-project' }" class="ask-anna-link">{{ projectData.name }}</router-link
        >.
      </v-alert>
    </v-card>
  </ask-anna-loading-progress>
</template>

<script setup lang="ts">
import { set } from 'lodash'
import { useRouter } from '@u3u/vue-hooks'
import usePermission from '@/core/composition/usePermission'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, computed, onBeforeMount } from '@vue/composition-api'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

import Project from '@/features/project/components/Project.vue'

const { route } = useRouter()
const snackBar = useSnackBar()
const router = useRouterAskAnna()
const permission = usePermission()
const projectStore = useProjectStore()
const workspaceStore = useWorkspaceStore()

const { routeBackTo = 'workspace-project' } = route.value.params

const projectData = computed(() => projectStore.project.value)
const loading = computed(() => projectStore.projectLoading.value)
const projectTemplates = computed(() => projectStore.projectTemplates.value)
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))
const workspaceProjectVisibility = computed(() => workspaceStore.state.workspace.value.visibility)

const projectState = ref({
  name: projectData.value.name,
  visibility: projectData.value.visibility,
  description: projectData.value.description
})

const fetchData = async () => projectStore.getProjectTemplates()

onBeforeMount(() => fetchData())

const handleOnInput = ({ path, value }) => {
  set(projectState.value, path, value)
}
const handleUpdate = async () => {
  const project = await projectStore.updateProject(projectState.value)

  if (routeBackTo === 'workspace') {
    await workspaceStore.getInitialWorkpaceProjects({ params: { limit: 99, offset: 0 } })
  }
  if (project?.short_uuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
    handleCancel()
  }
}
const handleCancel = () => {
  router.push({
    name: routeBackTo
  })
}

watch(projectData, projectData => {
  projectState.value = {
    name: projectData.name,
    visibility: projectData.visibility,
    description: projectData.description
  }
})
</script>
