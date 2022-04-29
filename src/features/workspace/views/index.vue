<template>
  <router-view />
</template>

<script lang="ts">
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'
import { onUpdated, onBeforeMount, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  setup(_, context) {
    const token = window.localStorage.getItem('token')

    const reShortUuid = /[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}$/g

    const router = useRouterAskAnna()
    const workspaceStore = useWorkspaceStore()
    const workspacesStore = useWorkspacesStore()

    const initWorkspace = async workspaceId => {
      if (!workspaceId) {
        router.push({ path: `/` })

        return
      }

      //check if worskpace short_uuid match pattern
      // on match get workspace, project, people
      // if not => redirect to /
      const isValidShortUuid = workspaceId.match(reShortUuid)

      if (isValidShortUuid && isValidShortUuid[0] === workspaceId) {
        await workspaceStore.actions.getCurrentPeople({ workspaceId })
        await workspaceStore.actions.getWorkspace(workspaceId)
        await workspaceStore.actions.getInitialWorkpaceProjects({ workspaceId, params: { limit: 99, offset: 0 } })
      } else {
        router.push({ path: `/` })
      }
    }

    const fetchData = async () => {
      await workspaceStore.reset()

      // check rounte param workspaceId, get from store if not present in params
      let { workspaceId } = context.root.$route.params

      if (workspaceId === 'workspace' && workspacesStore.workspaces.results.length) {
        workspaceId = workspacesStore.workspaces.results[0].short_uuid
        router.push({ path: `/${workspaceId}` })
      }

      //get current workspace, first project, people
      if (workspaceId !== 'workspace') {
        await initWorkspace(workspaceId)
      } else {
        setTimeout(() => workspaceStore.setLoading({ projects: false }), 100)
      }
    }

    onBeforeMount(() => fetchData())

    onUpdated(async () => {
      if (!token) return

      const { workspaceId } = context.root.$route.params

      if (workspaceId === workspaceStore.state.workspace.value.short_uuid) return

      workspaceStore.setLoading({ projects: true })

      await initWorkspace(workspaceId)
    })
  }
})
</script>
