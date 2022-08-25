<template>
  <router-view />
</template>

<script setup lang="ts">
import { onUpdated, onBeforeMount } from '@vue/composition-api'
import { usePeopleStore } from '@/features/people/usePeopleStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'
import { useWorkspaceProjectsStore } from '@/features/workspace/useWorkspaceProjectsStore'

const token = window.localStorage.getItem('token')

const reShortUuid = /[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}$/g

const router = useRouterAskAnna()
const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

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
    await peopleStore.getCurrentPeople({ workspaceId })
    await workspaceStore.getWorkspace(workspaceId)
    await workspaceProjectsStore.getInitialWorkpaceProjects({ workspaceId, params: { limit: 99, offset: 0 } })
  } else {
    router.push({ path: `/` })
  }
}

const fetchData = async () => {
  await workspaceProjectsStore.$reset()

  // check rounte param workspaceId, get from store if not present in params
  let { workspaceId } = router.route.value.params

  if (workspaceId === 'workspace' && workspacesStore.workspaces.results.length) {
    workspaceId = workspacesStore.workspaces.results[0].short_uuid
    router.push({ path: `/${workspaceId}` })
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

  const { workspaceId } = router.route.value.params

  if (workspaceId === workspaceStore.workspace.short_uuid) return

  workspaceProjectsStore.loading = true

  await initWorkspace(workspaceId)
})
</script>
