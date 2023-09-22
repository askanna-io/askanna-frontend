<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaInfiniteScroll
      @load="onLoadMore"
      class="-mt-3"
    >
      <template v-slot:empty>
        <div class="h-2 w-2"></div>
      </template>
      <WorkspaceProjectList
        :items="projects"
        :queryParams="queryParams"
        :workspaceName="workspaceStore.workspace.name"
      />
    </AskAnnaInfiniteScroll>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
const { route } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const queryParams = computed(() => route.query)
const workspaceId = computed(() => route.params.workspaceId)

const loading = computed(() => workspaceProjectsStore.loading)
const next = computed(() => workspaceProjectsStore.projects.next)
const projects = computed(() => workspaceProjectsStore.projects.results)

const { onLoadMore } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  suuid: workspaceId,
  store: workspaceStore,
  storeAction: workspaceProjectsStore.getWorkpaceProjects
})
</script>