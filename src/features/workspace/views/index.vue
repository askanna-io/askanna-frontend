<template>
  <router-view />
</template>

<script>
import useWorkspaceStore from '../composition/useWorkSpaceStore'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    onBeforeMount(async () => {
      if (!workspaceStore.workspaces.value.count) {
        workspaceStore.getWorkspaces()
      }
      let { workspaceId } = context.root.$route.params

      if (workspaceId === 'workspace') {
        workspaceId = workspaceStore.workspaces.value.results[0].short_uuid
        context.root.$router.push({ path: `/${workspaceId}` })
        return
      }

      // if (workspaceStore.workspace.value.short_uuid === workspaceId) return

      workspaceStore.getWorkspace(workspaceId)
      workspaceStore.getWorkpaceProjects(workspaceId)
    })
  }
})
</script>
