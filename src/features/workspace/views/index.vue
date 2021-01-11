<template>
  <router-view />
</template>

<script>
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { computed, reactive, onUpdated, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const initWorkspace = async workspaceId => {
      await workspaceStore.getWorkspace(workspaceId)
      await workspaceStore.getInitialWorkpaceProjects({ params: { limit: 99, offset: 0 } })
      await workspaceStore.actions.getInitialWorkpacePeople({ workspaceId })
    }

    onBeforeMount(async () => {
      workspaceStore.reset()

      // get workspaces if they not in store
      if (!workspaceStore.workspaces.value.count) {
        await workspaceStore.getWorkspaces()
      }

      // check rounte param workspaceId, get from store if not present in params
      let { workspaceId } = context.root.$route.params

      if (workspaceId === 'workspace' && workspaceStore.workspaces.value.results.length) {
        workspaceId = workspaceStore.workspaces.value.results[0].short_uuid
        context.root.$router.push({ path: `/${workspaceId}` })
      }

      //get current workspace, first project, people
      if (workspaceId !== 'workspace') {
        await initWorkspace(workspaceId)
      } else {
        await workspaceStore.setLoading({ projects: false })
      }
    })

    onUpdated(async () => {
      const { workspaceId } = context.root.$route.params

      if (workspaceId !== workspaceStore.workspace.value.short_uuid) {
        await initWorkspace(workspaceId)
      }
    })
  }
})
</script>
