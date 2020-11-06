<template>
  <div>
    <workspace-project-list
      v-scroll="throttle(onScroll, 1000)"
      :loading="loading"
      :settings="workspaceSettings"
      :workspaceName="workspace.title"
      :items="workspaceProjects.results"
    />

    <ask-anna-divider v-if="isNotBeta" text="Latest Activity" />
    <ask-anna-time-lines v-if="isNotBeta" text="Latest Activity" />
  </div>
</template>
<script>
import { throttle } from 'lodash'
import useQuery from '@/core/composition/useQuery'
import { computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspaceProjectList from '@/features/workspace/components/WorkspaceProjectList.vue'

export default defineComponent({
  name: 'workspace',

  components: { WorkspaceProjectList },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const query = useQuery({
      offset: 100,
      limit: 18,
      store: workspaceStore,
      action: 'getWorkpaceProjects',
      queryPath: 'workspaceProjects'
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      loading: workspaceStore.workspaceProjectsLoading,
      workspaceProjects: workspaceStore.workspaceProjects,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
