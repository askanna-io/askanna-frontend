<template>
  <div>
    <v-row justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
        <v-expansion-panels class="login-expansion" v-model="panel">
          <signin v-if="!signUpStep" />
          <template v-if="!signUpStep">
            <signup />
          </template>
          <v-expand-transition>
            <template v-if="signUpStep === 1">
              <wait-before-create-account />
            </template>
          </v-expand-transition>
        </v-expansion-panels>
        <signin-thank-you v-if="signUpStep === 2" />
      </v-col>
    </v-row>
    <v-row v-if="panel" align="center" justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <v-expansion-panels class="login-expansion" v-model="panel">
          <v-expand-transition>
            <ask-anna-read-more />
          </v-expand-transition>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Signin from './signin.vue'
import Signup from './signup.vue'
import SigninThankYou from './signin-thank-you.vue'
import { ref, provide, readonly } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import AskAnnaReadMore from '@/features/auth/components/AskAnnaReadMore.vue'
import WaitBeforeCreateAccount from '@/features/auth/components/signup/WaitBeforeCreateAccount.vue'

const router = useRouterAskAnna()

const panelValue = router.route.value.name === 'signin' ? 0 : 1

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
