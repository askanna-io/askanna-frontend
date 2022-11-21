<template>
  <div>
    <AskAnnaRow justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
        <VExpansionPanels class="login-expansion" v-model="panel">
          <SignIn v-if="!authStore.signUpStep" />
          <template v-if="!authStore.signUpStep">
            <SignUp />
          </template>
          <VExpandTransition>
            <template v-if="authStore.signUpStep === 1">
              <SignUpWaitBeforeCreateAccount />
            </template>
          </VExpandTransition>
        </VExpansionPanels>
        <SignInThankYou v-if="authStore.signUpStep === 2" />
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow v-if="panel" align="center" justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <VExpansionPanels class="login-expansion" v-model="panel">
          <VExpandTransition>
            <AskAnnaReadMore />
          </VExpandTransition>
        </VExpansionPanels>
      </AskAnnaCol>
    </AskAnnaRow>
  </div>
</template>

<script setup lang="ts">
import SignIn from './sign-in.vue'
import SignUp from './sign-up.vue'
import SignInThankYou from './sign-in-thank-you.vue'

const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const panelValue = route.name === 'signin' ? 0 : 1

const panel = ref(panelValue)
</script>
