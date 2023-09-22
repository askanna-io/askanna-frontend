<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />
  <div class="px-0 sm:px-2">
    <AskAnnaCard :variant="!$vuetify.display.xs ? 'outlined' : 'flat'">
      <AskAnnaCardTitle>
        <AskAnnaIcon
          class="pr-2"
          :icon="getIcon()"
        />Create a new project
      </AskAnnaCardTitle>

      <AskAnnaCardText>
        <p>A project is where you can collaborate with your team, or yourself. You can house files, code, jobs, runs and
          all (meta) data related to running your projects. In <a
            target="_blank"
            href="https://docs.askanna.io/project/"
          >the documentation</a> you can read more about an AskAnna project.
        </p>
      </AskAnnaCardText>

      <Project
        v-if="projectCreate"
        :projectData="projectData"
        :workspaceProjectVisibility="workspaceProjectVisibility"
        saveButtonText="Create Project"
        @handleCreate="handleCreate"
        @handleCancel="handleCancel"
        @handleOnInput="handleOnInput"
      />
      <AskAnnaAlert
        v-else
        density="compact"
        variant="outlined"
        class="m-4 text-center"
      >
        You are not allowed to create a project. I can bring you back to the workspace
        <RouterLink
          class="askanna-link"
          :to="{ name: 'workspace' }"
        >{{ workspaceName }}</RouterLink>.
      </AskAnnaAlert>
    </AskAnnaCard>
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const permission = useAskAnnaPermission()
const workSpaceStore = useWorkspaceStore()
const { route, router, routerPush } = useRouterAskAnna()

const workspaceName = computed(() => workSpaceStore.workspace.name)
const workspaceProjectVisibility = computed(() => workSpaceStore.workspace.visibility)
const projectCreate = computed(() => permission.getFor(permission.labels.projectCreate))

const projectData = computed(() => projectStore.project)

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.name,
    to: `/${workSpaceStore.workspace.suuid}`,
    disabled: false
  },
  {
    title: 'Create new project',
    to: '',
    disabled: true
  }
])

const getIcon = () => (projectData.value.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleOnInput = data => projectStore.setProject(data)

const handleCreate = async () => {
  const project = await projectStore.createProjectFullWay(route.params.workspaceId)
  if (project && project.suuid) {
    projectsStore.menu.projects = {
      count: 0,
      next: '',
      previous: '',
      results: []
    } // reset projects  to updated them on menu click

    routerPush({
      name: 'workspace-project-code',
      params: { projectId: project.suuid, workspaceId: project.workspace.suuid }
    })
  }
}
const handleCancel = () => {
  projectStore.resetProjectData()
  router.go(-1)
}
</script>
