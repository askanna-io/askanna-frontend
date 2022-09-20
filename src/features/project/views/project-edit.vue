<template>
  <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
    <v-card flat>
      <Project
        v-if="projectInfoEdit"
        :projectData="projectData"
        :saveButtonText="'Save my changes'"
        :workspaceProjectVisibility="workspaceProjectVisibility"
        @handleCreate="handleUpdate"
        @handleCancel="handleCancel"
        @handleOnInput="handleOnInput"
        @oSaveDescription="handleSaveDescription"
      />
      <v-alert v-else class="mx-2 my-4 text-center" dense outlined>
        You are not allowed to edit this project. I can bring you back to the project
        <router-link :to="{ name: 'workspace-project' }" class="ask-anna-link">{{ projectData.name }}</router-link
        >.
      </v-alert>
    </v-card>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const permission = usePermission()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspaceStore = useWorkspaceStore()
const { route, router } = useRouterAskAnna()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const { routeBackTo = 'workspace-project' } = route.params

const projectData = computed(() => projectStore.project)
const loading = computed(() => projectStore.projectLoading)

const workspaceProjectVisibility = computed(() => workspaceStore.workspace.visibility)
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

const projectState = ref({
  name: projectData.value.name,
  visibility: projectData.value.visibility,
  description: projectData.value.description
})

const handleOnInput = ({ path, value }) => {
  set(projectState.value, path, value)
}

const handleUpdate = async () => {
  const project = await projectStore.updateProject(projectState.value)

  if (routeBackTo === 'workspace') {
    await workspaceProjectsStore.getInitialWorkpaceProjects({ params: { limit: 99, offset: 0 } })
  }

  if (project?.short_uuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
    await projectsStore.getProjects() // call get all project to updated them on menu
    handleCancel()
  }
}

const handleSaveDescription = async () => {
  const project = await projectStore.updateProject({ description: projectState.value.description })

  if (project?.short_uuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
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
