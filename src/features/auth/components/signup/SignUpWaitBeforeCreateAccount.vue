<template>
  <AskAnnaCard>
    <AskAnnaCardTitle class="break">Wait a moment while we are creating your account</AskAnnaCardTitle>
    <AskAnnaCardText class="pb-2 text-body-1">
      You can wait while Anna is creating your account. This can take a couple of seconds. You can also do something
      else. We will send you an email once the account is ready.
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { routerPush } = useRouterAskAnna()
const prepareAccount = usePrepareAccount()

const polling = ref(null)
const isReady = computed(() => prepareAccount.IsAccountReady.value)

const checkIsReady = async () => {
  polling.value = setInterval(async () => {
    await prepareAccount.checkIfWorkspaceIsReady(authStore.authData)

    if (isReady.value) {
      clearInterval(polling.value)
      routerPush({ name: 'workspace', params: { workspaceId: prepareAccount.workspaceId.value } })
    }
  }, 5000)
}

onBeforeMount(() => checkIsReady())

onUnmounted(() => {
  clearInterval(polling.value)
})
</script>
<style scoped>
.break {
  word-break: normal;
}
</style>
