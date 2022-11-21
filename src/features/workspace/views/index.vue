<template>
  <RouterView />
</template>

<script setup lang="ts">
const token = window.localStorage.getItem('token')

const reShortUuid = /[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}$/g

const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()
const { route, routerPush } = useRouterAskAnna()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const initWorkspace = async workspaceId => {
  if (!workspaceId) {
    routerPush({ path: `/` })

    return
  }

  //check if worskpace suuid match pattern
  // on match get workspace, project, people
  // if not => redirect to /
  const isValidShortUuid = workspaceId.match(reShortUuid)

  if (isValidShortUuid && isValidShortUuid[0] === workspaceId) {
    await peopleStore.getCurrentPeople({ workspaceId })
    await workspaceStore.getWorkspace(workspaceId)
    await workspaceProjectsStore.getInitialWorkpaceProjects({ workspaceId, params: { limit: 99, offset: 0 } })
  } else {
    routerPush({ path: `/` })
  }
}

const fetchData = async () => {
  await workspaceProjectsStore.$reset()

  // check rounte param workspaceId, get from store if not present in params
  let { workspaceId } = route.params

  if (workspaceId === 'workspace' && workspacesStore.workspaces.results.length) {
    workspaceId = workspacesStore.workspaces.results[0].suuid
    routerPush({ path: `/${workspaceId}` })
  }

  //get current workspace, first project, people
  if (workspaceId !== 'workspace') {
    await initWorkspace(workspaceId)
  } else {
    setTimeout(() => (workspaceProjectsStore.loading = false), 100)
  }
}

onBeforeMount(() => fetchData())

onUpdated(async () => {
  if (!token) return

  const { workspaceId } = route.params

  if (workspaceId === workspaceStore.workspace.suuid) return

  workspaceProjectsStore.loading = true

  await initWorkspace(workspaceId)
})
</script>
