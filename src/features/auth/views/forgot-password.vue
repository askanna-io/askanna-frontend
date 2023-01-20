<template>
  <AskAnnaRow justify="center" class="login-wrapper">
    <AskAnnaCol cols="6" xl="2" md="6" sm="9" lg="4" class="rounded">
      <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
      <VExpansionPanels readonly class="login-expansion" :value="0">
        <VExpansionPanel :key="0" active-class="colored-border" class="white">
          <VExpansionPanelHeader hide-actions>
            <AskAnnaRow no-gutters>
              <AskAnnaCol cols="12" class="text-h6">Forgot your password?</AskAnnaCol>
              <AskAnnaCol cols="8" v-if="false">
                <VFadeTransition leave-absolute />
              </AskAnnaCol>
            </AskAnnaRow>
          </VExpansionPanelHeader>
          <VExpansionPanelContent>
            <SignInForgotPasswordSentForm />
          </VExpansionPanelContent>
        </VExpansionPanel>
      </VExpansionPanels>
    </AskAnnaCol>
  </AskAnnaRow>
</template>
