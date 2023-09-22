<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaInfiniteScroll @load="onLoadMore">
      <template v-slot:empty>
        <div class="h-2 w-2"></div>
      </template>
      <div class="pb-3 px-3">
        <TheProjectsToolbar />
      </div>

      <ul
        role="list"
        :class="{ 'px-2': $vuetify.display.xs }"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 list list-none px-3"
      >
        <li
          v-for="item in projects"
          :key="item.suuid"
          @click="handleOpenProject(item)"
        >
          <VHover
            v-slot:default="{ props, isHovering }"
            open-delay="150"
            close-delay="150"
          >
            <AskAnnaListCardItem
              v-bind="props"
              :name="item.name"
              :hover="isHovering"
              :visibility="item.visibility"
              :description="sanitizeHTML(item.description)"
              :to="{
                name: 'workspace-project-code',
                params: {
                  title: `${item.name} - ${item.workspace.name}`,
                  projectId: item.suuid,
                  workspaceId: item.workspace.suuid,
                  packageId: (item.package && item.package.suuid) || ''
                }
              }"
            />
          </VHover>
        </li>
      </ul>

      <AskAnnaAlert
        v-if="!loading && !projects.length"
        class="mx-3"
      >
        <template v-if="queryParams.search">There are no projects for this search request.</template>
        <template v-else-if="queryParams.visibility || queryParams.is_member">There are no projects for this filter
          request.</template>
        <template v-else>There are no projects that you have access to.</template>
      </AskAnnaAlert>
    </AskAnnaInfiniteScroll>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const sanitizeHTML = useSanitizeHTML()
const projectsStore = useProjectsStore()
const { route, routerPush } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const loading = computed(() => projectsStore.loading)
const next = computed(() => projectsStore.projects.next)
const projects = computed(() => projectsStore.projects.results)

const { onLoadMore } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  store: projectsStore,
  storeAction: projectsStore.getProjects
})

const handleOpenProject = project => {
  routerPush({
    name: 'workspace-project-code',
    params: {
      projectId: project.suuid,
      workspaceId: project.workspace.suuid,
      title: `${project.name} - ${project.workspace.name}`,
      packageId: (project.package && project.package.suuid) || ''
    }
  })
}
</script>