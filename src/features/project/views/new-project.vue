<template>
  <AskAnnaCard class="mx-auto" flat :outlined="!$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <VBreadcrumbs :items="breadcrumbs" class="pa-0 pl-3" :class="{ 'pa-4 pl-4': !$vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" exact>
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
    <AskAnnaDivider class="mt-1" />
    <AskAnnaCardTitle>
      <AskAnnaIcon large left> mdi-semantic-web </AskAnnaIcon>
      <span class="title font-weight-light">Create a new project</span>
    </AskAnnaCardTitle>

    <AskAnnaCardText class="font-weight-bold">
      <p>
        A project is where you can collaborate with your team, or yourself. You can house files, code, jobs, runs and
        all (meta) data related to running your projects.
      </p>
    </AskAnnaCardText>

    <AskAnnaDivider />

    <Project
      v-if="workspaceProjectCreate"
      :projectData="projectData"
      :workspaceProjectVisibility="workspaceProjectVisibility"
      @handleCreate="handleCreate"
      @handleCancel="handleCancel"
      @handleOnInput="handleOnInput"
    />
    <AskAnnaAlert v-else class="ma-4 text-center" dense outlined>
      You are not allowed to create a project. I can bring you back to the workspace
      <RouterLink :to="{ name: 'workspace' }" class="ask-anna-link">{{ workspaceName }}</RouterLink
      >.
    </AskAnnaAlert>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const permission = usePermission()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workSpaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()

const workspaceName = computed(() => workSpaceStore.workspace.name)
const workspaceProjectVisibility = computed(() => workSpaceStore.workspace.visibility)
const workspaceProjectCreate = computed(() => permission.getFor(permission.labels.workspaceProjectCreate))

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

const handleOnInput = data => projectStore.setProject(data)

const handleCreate = async () => {
  const project = await projectStore.createProjectFullWay(route.params.workspaceId)
  if (project && project.suuid) {
    await projectsStore.getProjects() // call get all project to updated them on menu

    routerPush({
      name: 'workspace-project-code',
      params: { projectId: project.suuid, workspaceId: project.workspace.suuid, packageId: '' }
    })
  }
}
const handleCancel = () => {
  projectStore.resetProjectData()
  router.go(-1)
}
</script>
