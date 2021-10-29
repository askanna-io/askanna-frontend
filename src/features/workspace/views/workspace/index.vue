<template>
  <div>
    <v-card v-if="isEditWorkspaceView" class="mx-auto mb-3" outlined>
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-card>
    <workspace-toolbar
      :isMember="isMember"
      :title="workspace.name"
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
<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspaceToolbar from '@/features/workspace/components/WorkspaceToolbar.vue'
import ConfirmDeleteWorkspacePopup from '@/features/workspace/components/project/ConfirmDeleteWorkspacePopup.vue'

export default defineComponent({
  name: 'workspace',

  components: { WorkspaceToolbar, ConfirmDeleteWorkspacePopup },

  setup(_, context) {
    const router = useRouterAskAnna()
    const workspaceStore = useWorkspaceStore()

    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 2 })

    const deleteWorkspaceConfirmPopup = ref(false)
    const isWorkspacePublic = computed(() => workspaceStore.getters.isWorkspacePublic.value)

    const loading = computed(() => workspaceStore.loading.value.projects)
    const isMember = computed(() => workspaceStore.workspace.value.is_member)

    const isEditWorkspaceView = computed(() => context.root.$route.name === 'workspace-edit')
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

    return {
      loading,
      isMember,
      breadcrumbs,
      isWorkspacePublic,
      isCurrentUserAdmin,
      isEditWorkspaceView,
      deleteWorkspaceConfirmPopup,
      workspace: workspaceStore.workspace,

      handleOpenWorkspaceRemove,
      handleCloseWorkspaceRemove,
      handleDeleteConfirmWorkspace
    }
  }
})
</script>
