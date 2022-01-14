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

    <project
      v-if="workspaceProjectCreate"
      :projectData="projectData"
      :projectTemplates="projectTemplates"
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
import usePermission from '@/core/composition/usePermission'
import Project from '@/features/project/components/Project.vue'
import { computed, onBeforeMount } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'

const router = useRouterAskAnna()
const permission = usePermission()
const projectStore = useProjectStore()
const workSpaceStore = useWorkSpaceStore()

const workspaceName = computed(() => workSpaceStore.workspace.value.name)
const workspaceProjectVisibility = computed(() => workSpaceStore.state.workspace.value.visibility)
const workspaceProjectCreate = computed(() => permission.getFor(permission.labels.workspaceProjectCreate))

const fetchData = async () => await projectStore.getProjectTemplates()

onBeforeMount(() => fetchData())

const projectData = computed(() => projectStore.project.value)
const projectTemplates = computed(() => projectStore.projectTemplates.value)

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.value.name,
    to: `/${workSpaceStore.workspace.value.short_uuid}`,
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
  const project = await projectStore.createProjectFullWay(router.route.value.params.workspaceId)
  if (project && project.short_uuid) {
    router.push({
      name: 'workspace-project-code',
      params: { projectId: project.short_uuid, workspaceId: project.workspace.short_uuid, packageId: '' }
    })
  }
}
const handleCancel = () => {
  projectStore.resetProjectData()
  router.router.go(-1)
}
</script>
