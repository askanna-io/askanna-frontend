<template>
  <router-view />
</template>

<script>
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    onBeforeMount(async () => {
      workspaceStore.reset()
      if (!workspaceStore.workspaces.value.count) {
        await workspaceStore.getWorkspaces()
      }
      let { workspaceId } = context.root.$route.params
      if (workspaceId === 'workspace' && workspaceStore.workspaces.value.results.length) {
        workspaceId = workspaceStore.workspaces.value.results[0].short_uuid
        context.root.$router.push({ path: `/${workspaceId}` })

        return
      }
      if (workspaceId !== 'workspace') {
        await workspaceStore.getWorkspace(workspaceId)
        await workspaceStore.getInitialWorkpaceProjects({ params: { limit: 99, offset: 0 } })
      } else {
        await workspaceStore.setLoading({ projects: false })
      }
    })
  }
})
</script>
