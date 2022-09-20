<template>
  <div>
    <v-card
      v-if="isEditWorkspaceView"
      flat
      class="mx-auto mb-3 pl-2"
      :outlined="!$vuetify.breakpoint.xsOnly"
      :class="{ 'pa-3 py-3': !$vuetify.breakpoint.xsOnly }"
    >
      <div class="askAnna-breadcrumbs">
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 pl-1">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>
    </v-card>
    <WorkspaceToolbar
      :isMember="isMember"
      :title="workspace.name"
      :workspaceUuid="workspace.short_uuid"
      :isWorkspacePublic="isWorkspacePublic"
      :isCurrentUserAdmin="isCurrentUserAdmin"
      @onOpenWorkspaceRemove="handleOpenWorkspaceRemove"
    />
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading" fullWidth>
      <router-view />
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
const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const { route, router } = useRouterAskAnna()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const breadcrumbs = useBreadcrumbs({ start: 0, end: 2 })

const deleteWorkspaceConfirmPopup = ref(false)
const isWorkspacePublic = computed(() => workspaceStore.isWorkspacePublic)

const workspace = computed(() => workspaceStore.workspace)
const loading = computed(() => workspaceProjectsStore.loading)
const isMember = computed(() => workspaceStore.workspace.is_member)

const isEditWorkspaceView = computed(() => route.name === 'workspace-edit')
const isCurrentUserAdmin = computed(() => peopleStore.currentPeople.role.code === 'WA')

const handleOpenWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = true)
const handleCloseWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = false)

const handleDeleteConfirmWorkspace = async () => {
  const isDeleted = await workspaceStore.deleteWorkspace(workspaceStore.workspace)
  deleteWorkspaceConfirmPopup.value = false

  if (isDeleted) {
    router.push({ path: '/' })
  }
}
</script>
