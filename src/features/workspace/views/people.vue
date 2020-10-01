<template>
  <div>
    <workspace-people-list
      v-scroll="throttle(onScroll, 1000)"
      :loading="loading"
      :settings="workspaceSettings"
      :workspaceUuid="workspace.uuid"
      :workspaceName="workspace.title"
      :items="workspacePeople.results"
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
    const { workspaceId } = context.root.$route.params

    onBeforeMount(async () => {
      await workspaceStore.getInitialWorkpacePeople({ workspaceId, params: { limit: 18, offset: 0 } })
    })

    const query = useQuery({
      limit: 18,
      offset: 18,
      uuid: workspaceId,
      store: workspaceStore,
      action: 'getWorkspacePeople',
      queryPath: 'workspacePeople'
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      loading: workspaceStore.workspacePeopleLoading,
      workspacePeople: workspaceStore.workspacePeople,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
