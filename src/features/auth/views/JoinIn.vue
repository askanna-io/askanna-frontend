<template>
  <AskAnnaLogoBig />

  <AskAnnaLoadingProgress
    :loading="loading"
    loadingTitle="Anna is checking your invitation..."
  >
    <TheJoin v-if="isInvitationValid" />
    <TheJoinInvalidInvitation v-else />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()

const { token, peopleId, workspaceId } = route.params

const loading = ref(true)
const isInvitationValid = computed(
  () => Boolean(peopleStore.invitation.email) && peopleStore.invitation.status !== 'active'
)

const fetchData = async () => {
  loading.value = true

  await authStore.logout()
  await peopleStore.getInvitetionInfo({
    token,
    peopleId,
    workspaceId
  })

  loading.value = false
}

onBeforeMount(() => fetchData())
</script>