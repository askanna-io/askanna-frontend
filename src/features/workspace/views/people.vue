<template>
  <div>
    <workspace-people-list
      v-scroll="throttle(onScroll, 1000)"
      :workspaceUuid="workspace.uuid"
      :settings="workspaceSettings"
      :workspaceName="workspace.title"
      :items="workspacePeople.results"
      :loading="loading"
    />
  </div>
</template>
<script>
import { throttle } from 'lodash'
import useQuery from '@/core/composition/useQuery'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacePeopleList from '@/features/workspace/components/people/WorkspacePeopleList.vue'

export default defineComponent({
  name: 'workspace',

  components: { WorkspacePeopleList },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    onBeforeMount(async () => {
      await workspaceStore.getInitialWorkpacePeople({ params: { limit: 18, offset: 0 } })
    })

    const query = useQuery({
      offset: 18,
      limit: 18,
      store: workspaceStore,
      action: 'getWorkspacePeople',
      queryPath: 'workspacePeople'
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      loading: workspaceStore.workspacePeopleLoading,
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      workspacePeople: workspaceStore.workspacePeople,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
