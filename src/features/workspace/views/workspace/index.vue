<template>
  <div>
    <workspace-toolbar :title="workspace.name" />
    <ask-anna-loading-progress :type="'table-row'" :loading="loading" fullWidth>
      <router-view />
    </ask-anna-loading-progress>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspaceToolbar from '@/features/workspace/components/WorkspaceToolbar.vue'

export default defineComponent({
  name: 'workspace',

  components: { WorkspaceToolbar },

  setup() {
    const workspaceStore = useWorkspaceStore()

    const loading = computed(() => workspaceStore.loading.value.projects)

    return {
      loading,
      workspace: workspaceStore.workspace
    }
  }
})
</script>
