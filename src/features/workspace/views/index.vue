<template>
  <RouterView />
</template>

<script setup lang="ts">
const token = window.localStorage.getItem('token')
const reShortUuid = /[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}$/g

const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()
const { route, routerPush } = useRouterAskAnna()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const workspaceId = computed(() => route.params?.workspaceId)

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
    if (token && !peopleStore.currentPeople.suuid) {
      await peopleStore.$reset()
      await peopleStore.getCurrentPeople({ workspaceId })
    }

    await workspaceStore.getWorkspace(workspaceId)
  } else {
    routerPush({ path: `/` })
  }
}

watch(
  workspaceId,
  async workspaceId => {
    if (workspaceId !== workspaceStore.workspace?.suuid) {
      workspaceProjectsStore.$reset()
      await initWorkspace(workspaceId)
    }
  },
  { immediate: true }
)
</script>
