<template>
  <div>
    <AskAnnaCard
      v-if="isEditWorkspaceView"
      flat
      class="mx-auto mb-3 pl-2"
      :outlined="!$vuetify.breakpoint.xsOnly"
      :class="{ 'pa-3 py-3': !$vuetify.breakpoint.xsOnly }"
    >
      <div class="askAnna-breadcrumbs">
        <VBreadcrumbs :items="breadcrumbs" class="pa-0 pl-1">
          <template v-slot:item="{ item }">
            <VBreadcrumbsItem :to="item.to" :exact="item.exact">
              {{ item.title }}
            </VBreadcrumbsItem>
          </template>
        </VBreadcrumbs>
      </div>
    </AskAnnaCard>
    <WorkspaceToolbar
      :isMember="isMember"
      :title="workspace.name"
      :workspaceUuid="workspace.suuid"
      :isWorkspacePublic="isWorkspacePublic"
      :isCurrentUserAdmin="isCurrentUserAdmin"
      @onOpenWorkspaceRemove="handleOpenWorkspaceRemove"
    />

    <RouterView />

    <WorkspaceConfirmDeletePopup
      :workspaceName="workspace.name"
      :value="deleteWorkspaceConfirmPopup"
      @onClose="handleCloseWorkspaceRemove"
      @onDeleteConfirm="handleDeleteConfirmWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 2 })

const deleteWorkspaceConfirmPopup = ref(false)
const isWorkspacePublic = computed(() => workspaceStore.isWorkspacePublic)

const workspace = computed(() => workspaceStore.workspace)
const isMember = computed(() => workspaceStore.workspace.is_member)

const isEditWorkspaceView = computed(() => route.name === 'workspace-edit')
const isCurrentUserAdmin = computed(() => peopleStore.currentPeople.role.code === 'WA')

const handleOpenWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = true)
const handleCloseWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = false)

const handleDeleteConfirmWorkspace = async () => {
  const isDeleted = await workspaceStore.deleteWorkspace(workspaceStore.workspace)
  deleteWorkspaceConfirmPopup.value = false

  if (isDeleted) {
    routerPush({ path: '/' })
  }
}
</script>
