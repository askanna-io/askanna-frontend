<template>
  <v-card class="mx-auto" flat :outlined="!$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 pl-3" :class="{ 'pa-4 pl-4': !$vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
    <v-divider class="mt-1" />
    <v-card-title>
      <v-icon large left> mdi-semantic-web </v-icon>
      <span class="title font-weight-light">Create a new project</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      <p>
        A project is where you can collaborate with your team, or yourself. You can house files, code, jobs, runs and
        all (meta) data related to running your projects.
      </p>
    </v-card-text>

    <v-divider />

    <Project
      v-if="workspaceProjectCreate"
      :projectData="projectData"
      :workspaceProjectVisibility="workspaceProjectVisibility"
      @handleCreate="handleCreate"
      @handleCancel="handleCancel"
      @handleOnInput="handleOnInput"
    />
    <v-alert v-else class="ma-4 text-center" dense outlined>
      You are not allowed to create a project. I can bring you back to the workspace
      <router-link :to="{ name: 'workspace' }" class="ask-anna-link">{{ workspaceName }}</router-link
      >.
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
const permission = usePermission()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workSpaceStore = useWorkspaceStore()
const { route, router } = useRouterAskAnna()

const workspaceName = computed(() => workSpaceStore.workspace.name)
const workspaceProjectVisibility = computed(() => workSpaceStore.workspace.visibility)
const workspaceProjectCreate = computed(() => permission.getFor(permission.labels.workspaceProjectCreate))

const projectData = computed(() => projectStore.project)

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.name,
    to: `/${workSpaceStore.workspace.short_uuid}`,
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
  if (project && project.short_uuid) {
    await projectsStore.getProjects() // call get all project to updated them on menu

    router.push({
      name: 'workspace-project-code',
      params: { projectId: project.short_uuid, workspaceId: project.workspace.short_uuid, packageId: '' }
    })
  }
}
const handleCancel = () => {
  projectStore.resetProjectData()
  router.go(-1)
}
</script>
