<template>
  <workspace-project-list
    v-scroll="throttle(onScroll, 1000)"
    :settings="workspaceSettings"
    :workspaceName="workspace.name"
    :items="workspaceProjects.results"
  />
</template>
<script lang="ts">
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

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      workspaceProjects: workspaceStore.workspaceProjects,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
