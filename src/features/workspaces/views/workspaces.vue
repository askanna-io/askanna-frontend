<template>
  <div>
    <AskAnnaLoadingProgress :loading="loading">
      <VDataIterator
        :items="workspaces"
        hide-default-footer
        :no-data-text="''"
        disable-pagination
        v-scroll="throttle(handleOnScroll, 1000)"
      >
        <template v-slot:header>
          <WorkspacesToolbar />
        </template>
        <template v-slot:default="props">
          <AskAnnaRow :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
            <AskAnnaCol
              v-for="item in props.items"
              @click="handleOpenWorkspace(item)"
              :key="item.name + item.suuid"
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
                <WorkspacesCardItem
                  :workspace="item"
                  :hover="hover"
                  :routeBackTo="'workspaces'"
                  :description="sanitizeHTML(item.description)"
                  @onOpenWorkspaceRemove="handleOpenWorkspaceRemove(item)"
                />
              </VHover>
            </AskAnnaCol>
          </AskAnnaRow>
        </template>
        <template v-slot:no-data>
          <AskAnnaAlert
            v-if="!loading"
            class="mt-2 text-center"
            dense
            outlined
            :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
          >
            <template v-if="query.search">There are no workspaces for this search request.</template>
            <template v-else-if="query.visibility || query.is_member">There are no workspaces for this filter
              request.</template>
            <template v-else>There are no workspaces that you have access to.</template>
          </AskAnnaAlert>
        </template>
        <template v-slot:footer>
          <AskAnnaRow
            class="mt-2"
            align="center"
            justify="center"
          >
            <AskAnnaButton
              v-if="isLargeScreen && workspaces.length && next"
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
              >mdi-chevron-down</AskAnnaIcon>Show more workspaces
            </AskAnnaButton>
            <AskAnnaSpacer />
          </AskAnnaRow>
        </template>
      </VDataIterator>
    </AskAnnaLoadingProgress>
    <WorkspaceConfirmDeletePopup
      :workspaceName="workspace.name"
      :value="deleteWorkspaceConfirmPopup"
      @onClose="handleCloseWorkspaceRemove"
      @onDeleteConfirm="handleDeleteConfirmWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const context = getCurrentInstance()
const sanitizeHTML = useSanitizeHTML()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()
const { route, routerPush } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const next = computed(() => workspacesStore.workspaces.next)
const isLargeScreen = computed(() => (
  context?.proxy.$root.$vuetify.breakpoint.height >= 1500
))

const { onLoadMore, onScroll } = useQuery({
  next,
  queryParams,
  page_size: 27,
  loading: false,
  immediate: true,
  store: workspacesStore,
  storeAction: workspacesStore.getWorkspaces
})

const workspace = ref({})
const deleteWorkspaceConfirmPopup = ref(false)

const loading = computed(() => workspacesStore.loadingAll)
const workspaces = computed(() => workspacesStore.workspaces.results)

const handleOnScroll = e => onScroll(e.target.documentElement.scrollTop)

const handleOpenWorkspace = workspace => {
  routerPush({
    name: 'workspace',
    params: {
      workspaceId: workspace.suuid,
      title: `${workspace.name}`
    }
  })
}

const handleOpenWorkspaceRemove = item => {
  workspace.value = item
  deleteWorkspaceConfirmPopup.value = true
}
const handleCloseWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = false)

const handleDeleteConfirmWorkspace = async () => {
  await workspaceStore.deleteWorkspace(workspace.value)
  deleteWorkspaceConfirmPopup.value = false

  await workspacesStore.getWorkspaces({ ...queryParams, page_size: 27 })
}

const handleLoadMoreProjects = () => onLoadMore()
</script>