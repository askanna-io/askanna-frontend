<template>
  <div class="join-wrapper">
    <v-row justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pb-0">
        <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="pt-0">
        <AskAnnaLoadingProgress
          :type="'table-row'"
          :loading="loading"
          loadingTitle="Anna is checking your invitation..."
        >
          <Join v-if="isInvitationValid" />
          <JoinInvalidInvitation v-else />
        </AskAnnaLoadingProgress>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { route } = useRouterAskAnna()
const peopleStore = usePeopleStore()
const { token, peopleId, workspaceId } = route.params

const loading = ref(true)
const isInvitationValid = computed(
  () => Boolean(peopleStore.invitation.email) && peopleStore.invitation.status !== 'accepted'
)

const fetchData = async () => {
  loading.value = true

  await authStore.logout(false)
  await peopleStore.getInvitetionInfo({
    token,
    peopleId,
    workspaceId
  })

  loading.value = false
}

onBeforeMount(() => fetchData())
</script>
<style scoped>
.join-wrapper {
  height: 100vh;
  background-image: url('/assets/bg/askanna-bg-01.svg');
  background-size: cover;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}

.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
