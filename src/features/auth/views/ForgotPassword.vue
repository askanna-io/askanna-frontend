<template>
  <div class="flex items-center justify-center px-6 sm:px-0">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaLogoBig />
      <AskAnnaExpansionPanels :model-value="0">
        <VExpansionPanel :key="0">
          <VExpansionPanelTitle hide-actions>
            <AskAnnaTitle>
              Forgot your password?
            </AskAnnaTitle>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TheSignInForgotPasswordSentForm />
          </VExpansionPanelText>
        </VExpansionPanel>
      </AskAnnaExpansionPanels>
    </div>
  </div>
</template>