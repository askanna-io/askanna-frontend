<template>
  <workspace-project-list
    v-scroll="throttle(onScroll, 1000)"
    :items="projects"
    :queryParams="queryParams"
    :settings="workspaceStore.workspaceSettings"
    :workspaceName="workspaceStore.workspace.name"
  />
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { route } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const { workspaceId } = route.params

const queryParams = computed(() => route.query)
const next = computed(() => workspaceProjectsStore.allWorkspaceProjects.next)
const projects = computed(() => workspaceProjectsStore.getProjectsByParams(queryParams.value))

const query = useQuery({
  next,
  limit: 18,
  offset: 99,
  queryParams,
  suuid: workspaceId,
  store: workspaceStore,
  storeAction: workspaceProjectsStore.getWorkpaceProjects
})

const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)
</script>
