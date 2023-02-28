<template>
  <AskAnnaLoadingProgress
    :loading="loading"
    fullWidth
  >
    <WorkspaceProjectList
      v-scroll="throttle(handleOnScroll, 1000)"
      :items="projects"
      :queryParams="queryParams"
      :settings="workspaceStore.workspaceSettings"
      :workspaceName="workspaceStore.workspace.name"
    >
      <template slot="footer">
        <AskAnnaRow
          class="mt-2"
          align="center"
          justify="center"
        >
          <AskAnnaButton
            v-if="isLargeScreen && projects.length && next"
            small
            outlined
            color="secondary"
            :loading="loading"
            :disabled="loading"
            class="ml-3 btn--hover"
            @click="handleLoadMoreProjects"
          >
            <AskAnnaIcon
              color="secondary"
              left
            >mdi-chevron-down</AskAnnaIcon>Show more projects
          </AskAnnaButton>
          <AskAnnaSpacer />
        </AskAnnaRow>
      </template>
    </WorkspaceProjectList>

  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { route } = useRouterAskAnna()
const context = getCurrentInstance()
const workspaceStore = useWorkspaceStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const queryParams = computed(() => route.query)
const workspaceId = computed(() => route.params.workspaceId)

const loading = computed(() => workspaceProjectsStore.loading)
const next = computed(() => workspaceProjectsStore.projects.next)
const projects = computed(() => workspaceProjectsStore.projects.results)
const isLargeScreen = computed(() => (
  context?.proxy.$root.$vuetify.breakpoint.height >= 1500
))

const { onLoadMore, onScroll } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  suuid: workspaceId,
  store: workspaceStore,
  storeAction: workspaceProjectsStore.getWorkpaceProjects
})

const handleLoadMoreProjects = () => onLoadMore()

const handleOnScroll = e => onScroll(e.target.documentElement.scrollTop)
</script>
