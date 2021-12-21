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
    <workspace-toolbar
      :isMember="isMember"
      :title="workspace.name"
      :workspaceUuid="workspace.short_uuid"
      :isWorkspacePublic="isWorkspacePublic"
      :isCurrentUserAdmin="isCurrentUserAdmin"
      @onOpenWorkspaceRemove="handleOpenWorkspaceRemove"
    />
    <ask-anna-loading-progress :type="'table-row'" :loading="loading" fullWidth>
      <router-view />
    </ask-anna-loading-progress>
    <confirm-delete-workspace-popup
      :value="deleteWorkspaceConfirmPopup"
      :workspaceName="workspace.name"
      @onClose="handleCloseWorkspaceRemove"
      @onDeleteConfirm="handleDeleteConfirmWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { ref, computed } from '@vue/composition-api'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspaceToolbar from '@/features/workspace/components/WorkspaceToolbar.vue'
import ConfirmDeleteWorkspacePopup from '@/features/workspace/components/project/ConfirmDeleteWorkspacePopup.vue'

const { route } = useRouter()
const router = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()

const breadcrumbs = useBreadcrumbs({ start: 0, end: 2 })

const deleteWorkspaceConfirmPopup = ref(false)
const isWorkspacePublic = computed(() => workspaceStore.getters.isWorkspacePublic.value)

const workspace = computed(() => workspaceStore.workspace.value)
const loading = computed(() => workspaceStore.loading.value.projects)
const isMember = computed(() => workspaceStore.workspace.value.is_member)

const isEditWorkspaceView = computed(() => route.value.name === 'workspace-edit')
const isCurrentUserAdmin = computed(() => workspaceStore.currentPeople.value.role.code === 'WA')

const handleOpenWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = true)
const handleCloseWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = false)

const handleDeleteConfirmWorkspace = async () => {
  const isDeleted = await workspaceStore.actions.deleteWorkspace(workspaceStore.workspace.value)
  deleteWorkspaceConfirmPopup.value = false

  if (isDeleted) {
    router.push({ path: '/' })
  }
}
</script>
