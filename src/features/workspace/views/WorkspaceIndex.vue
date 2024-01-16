<template>
  <div
    class="px-0 sm:px-3 pt-0"
    :class="{ 'sm:pt-4 pb-2': !isEditWorkspaceView }"
  >
    <WorkspaceToolbar
      v-if="!isEditWorkspaceView"
      :isMember="isMember"
      :title="workspace.name"
      :workspaceUuid="workspace.suuid"
      :description="workspace.description"
      :isWorkspacePublic="isWorkspacePublic"
      :isCurrentUserAdmin="isCurrentUserAdmin"
      :createdAt="workspaceStore.workspace.created_at"
      :createdBy="workspaceStore.workspace.created_by"
      @onOpenWorkspaceRemove="handleOpenWorkspaceRemove"
    />
  </div>
  <RouterView />

  <WorkspaceConfirmDeletePopup
    :workspaceName="workspace.name"
    :value="deleteWorkspaceConfirmPopup"
    @onClose="handleCloseWorkspaceRemove"
    @onDeleteConfirm="handleDeleteConfirmWorkspace"
  />
</template>
<script setup lang="ts">
const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()

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