<template>
  <div>
    <workspace-project-list
      :workspaceUuid="workspace.uuid"
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
import useWorkspaceStore from '../composition/useWorkSpaceStore'
import WorkspaceProjectList from '../components/workspace/WorkspaceProjectList.vue'
import { watch, computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'workspace',

  components: { WorkspaceProjectList },

  setup(props, context) {
    const query = useQuery(context)
    const workspaceStore = useWorkspaceStore()

    return {
      workspace: workspaceStore.workspace,
      workspaceProjects: workspaceStore.workspaceProjects,
      workspaceSettings: workspaceStore.workspaceSettings,
      workspaceProjectsLoading: workspaceStore.workspaceProjectsLoading
    }
  }
})
</script>
