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
      // eslint-disable-next-line no-console
      console.log('initWorkspace =>', workspaceId)
      if (!workspaceId) {
        // eslint-disable-next-line no-console
        console.log('!workspaceId, redirect to / =>', workspaceId)

        router.push({ path: `/` })
        return
      }

      //check if worskpace short_uuid match pattern
      // on match get workspace, project, people
      // if not => redirect to /
      const isValidShortUuid = workspaceId.match(reShortUuid)

      // eslint-disable-next-line no-console
      console.log('isValidShortUuid =>', isValidShortUuid)

      if (isValidShortUuid && isValidShortUuid[0] === workspaceId) {
        await workspaceStore.actions.getCurrentPeople({ workspaceId })
        await workspaceStore.getWorkspace(workspaceId)
        await workspaceStore.getInitialWorkpaceProjects({ workspaceId, params: { limit: 99, offset: 0 } })
      } else {
        // eslint-disable-next-line no-console
        console.log('initWorkspace else condition, redirect to /')
        router.push({ path: `/` })
      }
    }

    const fetchData = async () => {
      // eslint-disable-next-line no-console
      console.log('fetchData start :', workspaceId)
      await workspaceStore.reset()

      // get workspaces if they not in store
      if (!workspaceStore.workspaces.value.count) {
        // eslint-disable-next-line no-console
        console.log('getWorkspaces:', workspaceId)
        await workspaceStore.getWorkspaces()
      }

      // check rounte param workspaceId, get from store if not present in params
      let { workspaceId } = context.root.$route.params
      // eslint-disable-next-line no-console
      console.log(workspaceId)

      if (workspaceId === 'workspace' && workspaceStore.workspaces.value.results.length) {
        // eslint-disable-next-line no-console
        console.log('router.push to workspace')
        workspaceId = workspaceStore.workspaces.value.results[0].short_uuid
        router.push({ path: `/${workspaceId}` })
      }

      //get current workspace, first project, people
      // eslint-disable-next-line no-console
      console.log('before call initWorkspace, workspaceId is:', workspaceId)
      if (workspaceId !== 'workspace') {
        // eslint-disable-next-line no-console
        console.log(' call initWorkspace, workspaceId is:', workspaceId)
        await initWorkspace(workspaceId)
      } else {
        // eslint-disable-next-line no-console
        console.log('else condition :', workspaceId)
        setTimeout(() => workspaceStore.setLoading({ projects: false }), 100)
      }
    }

    onBeforeMount(() => fetchData())

    onUpdated(async () => {
      // eslint-disable-next-line no-console
      console.log(token)
      if (!token) return

      const { workspaceId } = context.root.$route.params

      workspaceStore.setLoading({ projects: true })

      setTimeout(() => workspaceStore.setLoading({ projects: false }), 100)

      // eslint-disable-next-line no-console
      console.log(workspaceId, workspaceStore.workspace.value.short_uuid)
      if (workspaceId !== workspaceStore.workspace.value.short_uuid) {
        await initWorkspace(workspaceId)
      }
    })
  }
})
</script>
