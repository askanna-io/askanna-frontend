<template>
  <VExpansionPanel :key="1" active-class="colored-border" class="white">
    <VExpansionPanelHeader>
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="text-h6">Create a new account</AskAnnaCol>
        <AskAnnaCol cols="8" v-if="false">
          <VFadeTransition leave-absolute />
        </AskAnnaCol>
      </AskAnnaRow>
    </VExpansionPanelHeader>
    <VExpansionPanelContent>
      <TheSignUp />
    </VExpansionPanelContent>
  </VExpansionPanel>
</template>
