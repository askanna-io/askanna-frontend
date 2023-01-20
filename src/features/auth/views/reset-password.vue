<template>
  <div class="d-flex flex-column justify-center login-wrapper">
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="12" class="rounded">
        <AskAnnaRow align="center" justify="center">
          <AskAnnaCol cols="6" xl="2" md="4" sm="6" class="pb-0 mb-0">
            <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaLoadingProgress :loading="loading" loadingTitle="Anna is checking your token...">
          <AskAnnaRow align="center" justify="center" v-if="isInvitationValid">
            <AskAnnaCol cols="6" xl="2" md="4" sm="6" class="rounded">
              <VExpansionPanels class="login-expansion" readonly mandatory>
                <VExpansionPanel :key="0" active-class="colored-border">
                  <VExpansionPanelHeader hide-actions>
                    <AskAnnaRow no-gutters>
                      <AskAnnaCol cols="12" class="text-h6">Reset your password</AskAnnaCol>
                    </AskAnnaRow>
                  </VExpansionPanelHeader>
                  <VExpansionPanelContent>
                    <SignInResetForm />
                  </VExpansionPanelContent>
                </VExpansionPanel>
              </VExpansionPanels>
            </AskAnnaCol>
          </AskAnnaRow>

          <SignInInvalidResetPasswordToken v-else />
        </AskAnnaLoadingProgress>
      </AskAnnaCol>
    </AskAnnaRow>
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
