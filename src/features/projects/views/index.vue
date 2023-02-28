<template>
  <AskAnnaLoadingProgress :loading="loading">
    <VDataIterator
      :items="projects"
      hide-default-footer
      :no-data-text="''"
      disable-pagination
      v-scroll="throttle(handleOnScroll, 700)"
    >
      <template v-slot:header>
        <PublicProjectsToolbar />
      </template>
      <template v-slot:default="props">
        <AskAnnaRow :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <AskAnnaCol
            v-for="item in props.items"
            @click="handleOpenProject(item)"
            :key="item.suuid"
            cols="12"
            sm="6"
            md="4"
            lg="4"
            :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
          >
            <VHover
              v-slot:default="{ hover }"
              open-delay="200"
            >
              <WorkspaceProjectCardItem
                :project="item"
                :hover="hover"
                :routeBackTo="'projects'"
                :workspaceName="item.workspace.name"
                :description="sanitizeHTML(item.description)"
              />
            </VHover>
          </AskAnnaCol>
        </AskAnnaRow>
      </template>
      <template v-slot:no-data>
        <AskAnnaAlert
          v-if="!loading"
          dense
          outlined
          class="mt-2 text-center"
          :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
        >
          <template v-if="queryParams.search">There are no projects for this search request.</template>
          <template v-else-if="queryParams.visibility || queryParams.is_member">There are no projects for this filter
            request.</template>
          <template v-else>There are no projects that you have access to.</template>
        </AskAnnaAlert>
      </template>
      <template v-slot:footer>
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
    </VDataIterator>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const context = getCurrentInstance()
const sanitizeHTML = useSanitizeHTML()
const projectsStore = useProjectsStore()
const { route, routerPush } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const loading = computed(() => projectsStore.loading)
const next = computed(() => projectsStore.projects.next)
const projects = computed(() => projectsStore.projects.results)
const isLargeScreen = computed(() => (
  context?.proxy.$root.$vuetify.breakpoint.height >= 1500
))

const { onLoadMore, onScroll } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  store: projectsStore,
  storeAction: projectsStore.getProjects
})

const handleOnScroll = e => onScroll(e.target.documentElement.scrollTop)

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

const handleLoadMoreProjects = () => onLoadMore()
</script>
