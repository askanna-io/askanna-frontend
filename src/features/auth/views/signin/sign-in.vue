<template>
  <VExpansionPanel :key="0" active-class="colored-border" class="white">
    <VExpansionPanelHeader>
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="text-h6">Sign in</AskAnnaCol>
        <AskAnnaCol cols="8" v-if="false">
          <VFadeTransition leave-absolute />
        </AskAnnaCol>
      </AskAnnaRow>
    </VExpansionPanelHeader>
    <VExpansionPanelContent>
      <TheSignIn />
      <SignInForgotPasswordLink />
    </VExpansionPanelContent>
  </VExpansionPanel>
</template>
