<template>
  <div class="login-layout">
    <AskAnnaRow justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pb-0">
        <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol class="pt-0">
        <AskAnnaLoadingProgress :loading="loading" loadingTitle="Anna is checking your invitation...">
          <Join v-if="isInvitationValid" />
          <JoinInvalidInvitation v-else />
        </AskAnnaLoadingProgress>
      </AskAnnaCol>
    </AskAnnaRow>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()

const { token, peopleId, workspaceId } = route.params

const loading = ref(true)
const isInvitationValid = computed(
  () => Boolean(peopleStore.invitation.email) && peopleStore.invitation.status !== 'accepted'
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
