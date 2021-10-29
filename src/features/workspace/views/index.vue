<template>
  <router-view />
</template>

<script>
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { computed, onUpdated, onBeforeMount, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  setup(_, context) {
    const token = window.localStorage.getItem('token')

    const reShortUuid = /[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}$/g
    const router = useRouterAskAnna()
    const workspaceStore = useWorkspaceStore()

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
        await workspaceStore.getWorkspace(workspaceId)
        await workspaceStore.getInitialWorkpaceProjects({ workspaceId, params: { limit: 99, offset: 0 } })
      } else {
        router.push({ path: `/` })
      }
    }

    const fetchData = async () => {
      await workspaceStore.reset()

      // get workspaces if they not in store
      if (!workspaceStore.workspaces.value.count) {
        await workspaceStore.getWorkspaces()
      }

      // check rounte param workspaceId, get from store if not present in params
      let { workspaceId } = context.root.$route.params

      if (workspaceId === 'workspace' && workspaceStore.workspaces.value.results.length) {
        workspaceId = workspaceStore.workspaces.value.results[0].short_uuid
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

      workspaceStore.setLoading({ projects: true })

      setTimeout(() => workspaceStore.setLoading({ projects: false }), 100)

      if (workspaceId !== workspaceStore.workspace.value.short_uuid) {
        await initWorkspace(workspaceId)
      }
    })
  }
})
</script>
