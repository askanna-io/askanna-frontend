<template>
  <div class="flex items-center justify-center flex-column h-full px-6 sm:px-0">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaLogoBig />
    </div>
    <AskAnnaLoadingProgress
      :loading="loading"
      loadingTitle="Anna is checking your token..."
    >
      <div
        v-if="isInvitationValid"
        class="flex items-center justify-center"
      >
        <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
          <AskAnnaExpansionPanels
            mandatory
            :model-value="0"
          >
            <VExpansionPanel :key="0">
              <VExpansionPanelTitle hide-actions>
                <AskAnnaTitle>Reset your password</AskAnnaTitle>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <TheSignInResetForm />
              </VExpansionPanelText>
            </VExpansionPanel>
          </AskAnnaExpansionPanels>
        </div>
      </div>

      <TheSignInInvalidResetPasswordToken v-else />
    </AskAnnaLoadingProgress>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const { token, uid } = route.query

const loading = ref(true)
const isInvitationValid = ref(false)

const fetchData = async () => {
  loading.value = true

  const tokenStatus = await authStore.resetTokenStatus({
    uid,
    token
  })

  if (tokenStatus && tokenStatus.status === 'valid') {
    isInvitationValid.value = true
  }

  loading.value = false
}

onBeforeMount(() => fetchData())
</script>