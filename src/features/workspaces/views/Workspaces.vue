<template>
  <AskAnnaInfiniteScroll @load="onLoadMore">
    <template v-slot:empty>
      <div class="h-2 w-2"></div>
    </template>
    <div class="pb-3 px-3">
      <TheWorkspacesToolbar />
    </div>
    <AskAnnaLoadingProgress :loading="loading">
      <ul
        role="list"
        :class="{ 'px-2': $vuetify.display.xs }"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 list list-none px-3"
      >
        <li
          v-for="item in workspaces"
          :key="item.suuid"
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
                name: 'workspace',
                params: {
                  workspaceId: item.suuid
                },
                meta: { title: `${item.name}}`, }
              }"
            />
          </VHover>
        </li>
      </ul>

      <AskAnnaAlert
        v-if="!loading && !workspaces.length"
        class="mt-2"
        :class="{ 'mx-2': $vuetify.display.xs }"
      >
        <template v-if="queryParams.search">There are no workspaces for this search request.</template>
        <template v-else-if="queryParams.visibility || queryParams.is_member">There are no workspaces for this filter
          request.</template>
        <template v-else>There are no workspaces that you have access to.</template>
      </AskAnnaAlert>
    </AskAnnaLoadingProgress>
  </AskAnnaInfiniteScroll>
</template>
<script setup lang="ts">

const sanitizeHTML = useSanitizeHTML()
const workspacesStore = useWorkspacesStore()
const { route, routerPush } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const next = computed(() => workspacesStore.workspaces.next)

const { onLoadMore } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  store: workspacesStore,
  storeAction: workspacesStore.getWorkspaces
})

const loading = computed(() => workspacesStore.loadingAll)
const workspaces = computed(() => workspacesStore.workspaces.results)
</script>