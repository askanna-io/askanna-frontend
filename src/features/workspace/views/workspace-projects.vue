<template>
  <AskAnnaLoadingProgress :loading="loading" fullWidth>
    <WorkspaceProjectList
      v-scroll="throttle(onScroll, 1000)"
      :items="projects"
      :queryParams="queryParams"
      :settings="workspaceStore.workspaceSettings"
      :workspaceName="workspaceStore.workspace.name"
    />
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { route } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const queryParams = computed(() => route.query)
const workspaceId = computed(() => route.params.workspaceId)

const loading = computed(() => workspaceProjectsStore.loading)
const next = computed(() => workspaceProjectsStore.projects.next)
const projects = computed(() => workspaceProjectsStore.projects.results)

const query = useQuery({
  next,
  queryParams,
  page_size: 25,
  loading: false,
  immediate: true,
  suuid: workspaceId,
  store: workspaceStore,
  storeAction: workspaceProjectsStore.getWorkpaceProjects
})

const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)
</script>
