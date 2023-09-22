<template>
  <AskAnnaLoadingProgress :loading="loading">
    <Project
      v-if="projectInfoEdit"
      :projectData="projectStore.form"
      :saveButtonText="'Save my changes'"
      :workspaceProjectVisibility="workspaceProjectVisibility"
      @handleCreate="handleUpdate"
      @handleCancel="handleCancel"
      @handleOnInput="handleOnInput"
      @oSaveDescription="handleSaveDescription"
    />
    <AskAnnaAlert
      v-else
      class="mx-2 my-4"
    >
      You are not allowed to edit this project. I can bring you back to the project
      <RouterLink
        class="askanna-link"
        :to="{ name: 'workspace-project' }"
      >{{ projectData.name }}</RouterLink>.
    </AskAnnaAlert>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const permission = useAskAnnaPermission()
const workspaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()

const projectData = computed(() => projectStore.project)
const loading = computed(() => projectStore.projectLoading)

const workspaceProjectVisibility = computed(() => workspaceStore.workspace.visibility)
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

const handleOnInput = ({ path, value }) => {
  set(projectStore.form, path, value)
}

const handleUpdate = async () => {
  const project = await projectStore.updateProject(projectStore.form)

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
  const project = await projectStore.updateProject({ description: projectStore.form.description })

  if (project?.suuid) {
    snackBar.showSnackBar({ message: `The project ${project.name} was updated`, color: 'success', timeout: 2500 })
  }
}

const handleCancel = () => {
  routerPush({
    name: 'workspace-project', params: { workspaceId: route.params.workspaceId, projectId: route.params.projectId }
  })
  projectStore.resetForm()
}
</script>
