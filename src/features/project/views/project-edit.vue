<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaCard flat>
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
      <AskAnnaAlert v-else class="mx-2 my-4 text-center" dense outlined>
        You are not allowed to edit this project. I can bring you back to the project
        <RouterLink :to="{ name: 'workspace-project' }" class="ask-anna-link">{{ projectData.name }}</RouterLink
        >.
      </AskAnnaAlert>
    </AskAnnaCard>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const permission = usePermission()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()
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

  if (project?.suuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })

    projectsStore.menu.projects = {
      count: 0,
      next: '',
      previous: '',
      results: []
    } // reset projects  to updated them on menu click

    handleCancel()
  }
}

const handleSaveDescription = async () => {
  const project = await projectStore.updateProject({ description: projectState.value.description })

  if (project?.suuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
  }
}

const handleCancel = () => {
  routerPush({
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
