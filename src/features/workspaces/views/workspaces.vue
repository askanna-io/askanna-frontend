<template>
  <div>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
      <v-data-iterator :items="workspaces" hide-default-footer :no-data-text="''" disable-pagination>
        <template v-slot:header>
          <WorkspacesToolbar />
        </template>
        <template v-slot:default="props">
          <AskAnnaRow :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
            <AskAnnaCol
              v-for="item in props.items"
              @click="handleOpenWorkspace(item)"
              :key="item.name + item.short_uuid"
              cols="12"
              sm="6"
              md="4"
              lg="4"
              :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
            >
              <v-hover v-slot:default="{ hover }" open-delay="200">
                <WorkspacesCardItem
                  :workspace="item"
                  :hover="hover"
                  :routeBackTo="'workspaces'"
                  :description="sanitizeHTML(item.description)"
                  @onOpenWorkspaceRemove="handleOpenWorkspaceRemove(item)"
                />
              </v-hover>
            </AskAnnaCol>
          </AskAnnaRow>
        </template>
        <template v-slot:no-data
          ><AskAnnaAlert
            v-if="!loading"
            class="mt-2 text-center"
            dense
            outlined
            :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
          >
            <template v-if="query.search">There are no workspaces for this search request.</template>
            <template v-else-if="query.visibility || query.is_member"
              >There are no workspaces for this filter request.</template
            >
          </AskAnnaAlert></template
        >
      </v-data-iterator>
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
const sanitizeHTML = useSanitizeHTML()
const workspaceStore = useWorkspaceStore()
const { route, router } = useRouterAskAnna()
const workspacesStore = useWorkspacesStore()

const workspace = ref({})
const deleteWorkspaceConfirmPopup = ref(false)

const query = computed(() => route.query)
const loading = computed(() => workspacesStore.loadingAll)
const workspaces = computed(() => workspacesStore.getWorkspacesByParams(query.value))

const handleOpenWorkspace = workspace => {
  router.push({
    name: 'workspace',
    params: {
      workspaceId: workspace.short_uuid,
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

  await workspacesStore.getAllWorkspaces()
}
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
