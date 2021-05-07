<template>
  <div>
    <workspace-project-list
      v-scroll="throttle(onScroll, 1000)"
      :loading="loading"
      :settings="workspaceSettings"
      :workspaceName="workspace.name"
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

  setup() {
    const workspaceStore = useWorkspaceStore()

    const next = computed(() => workspaceStore.state.workspaceProjects.value.next)

    const query = useQuery({
      next,
      limit: 18,
      offset: 99,
      store: workspaceStore,
      storeAction: workspaceStore.actions.getWorkpaceProjects
    })

    const loading = computed(() => workspaceStore.loading.value.projects)

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      loading,
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      workspaceProjects: workspaceStore.workspaceProjects,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
