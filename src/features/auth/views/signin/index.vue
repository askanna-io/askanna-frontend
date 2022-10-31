<template>
  <div>
    <AskAnnaRow justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
        <v-expansion-panels class="login-expansion" v-model="panel">
          <signin v-if="!signUpStep" />
          <template v-if="!signUpStep">
            <signup />
          </template>
          <v-expand-transition>
            <template v-if="signUpStep === 1">
              <SignUpWaitBeforeCreateAccount />
            </template>
          </v-expand-transition>
        </v-expansion-panels>
        <signin-thank-you v-if="signUpStep === 2" />
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow v-if="panel" align="center" justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <v-expansion-panels class="login-expansion" v-model="panel">
          <v-expand-transition>
            <AskAnnaReadMore />
          </v-expand-transition>
        </v-expansion-panels>
      </AskAnnaCol>
    </AskAnnaRow>
  </div>
</template>

<script setup lang="ts">
import signin from './signin.vue'
import signup from './signup.vue'

const { route } = useRouterAskAnna()

const panelValue = route.name === 'signin' ? 0 : 1

const signUpStep = ref(0)
const panel = ref(panelValue)
const authData = ref({ username: '', password: '' })

const updateAuthData = value => (authData.value = value)
const updateSignUpStep = value => (signUpStep.value = value)

provide('authData', readonly(authData))
provide('updateAuthData', updateAuthData)
provide('signUpStep', readonly(signUpStep))
provide('updateSignUpStep', updateSignUpStep)
</script>
