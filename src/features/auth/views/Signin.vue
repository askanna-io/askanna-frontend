<template>
  <div class="flex items-center justify-center px-6 sm:px-0">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaLogoBig />

      <AskAnnaExpansionPanels
        v-model="panel"
        mandatory
      >
        <TheSignIn v-if="!authStore.signUpStep" />
        <template v-if="!authStore.signUpStep">
          <TheSignUp />
        </template>
        <VExpandTransition>
          <template v-if="authStore.signUpStep === 1">
            <TheSignUpWaitBeforeCreateAccount />
          </template>
        </VExpandTransition>
      </AskAnnaExpansionPanels>
    </div>
  </div>
  <div
    v-if="panel"
    class="flex items-center px-6 sm:px-0 justify-center pt-4 pb-4"
  >
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaExpansionPanels
        mandatory
        :model-value="0"
      >
        <VExpansionPanel :key="0">
          <VExpansionPanelTitle
            hide-actions
            class="h-10 pb-0  min-h-min"
          >
            <AskAnnaTitle>
              What's AskAnna?
            </AskAnnaTitle>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <AskAnnaReadMore />
          </VExpansionPanelText>
        </VExpansionPanel>
      </AskAnnaExpansionPanels>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const panelValue = route.name === 'signin' ? 0 : 1

const panel = ref(panelValue)
</script>