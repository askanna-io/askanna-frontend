<template>
  <div>
    <workspace-project-list
      :settings="workspaceSettings"
      :workspaceName="workspace.title"
      :items="workspaceProjects.results"
      :loading="workspaceProjectsLoading"
    />
    <ask-anna-divider v-if="isNotBeta" text="Latest Activity" />
    <ask-anna-time-lines v-if="isNotBeta" text="Latest Activity" />
  </div>
</template>
<script>
import useQuery from '@/core/composition/useQuery'
import useWorkSpaceStore from '../composition/useWorkSpaceStore'
import WorkspaceToolbar from '../components/workspace/WorkspaceToolbar.vue'
import WorkspaceProjectList from '../components/workspace/WorkspaceProjectList.vue'
import { watch, computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TheWorkspace',

  components: { WorkspaceProjectList, WorkspaceToolbar },

  setup(props, context) {
    const query = useQuery(context)
    const workSpaceStore = useWorkSpaceStore()

    onBeforeMount(async () => {
      await workSpaceStore.getWorkspaces()
      let workspace = workSpaceStore.workspace.value

      if (!workspace.short_uuid) {
        ;[workspace] = workSpaceStore.workspaces.value.results
      }

      workSpaceStore.getWorkspace(workspace.short_uuid)
      workSpaceStore.getWorkpaceProjects(workspace.short_uuid)
    })

    return {
      ...workSpaceStore
    }
  }
})
</script>
