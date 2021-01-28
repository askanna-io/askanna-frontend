<template>
  <div>
    <v-row justify="center">
      <v-col cols="8" xl="2" md="6" sm="9" lg="4" class="rounded">
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
      <v-col cols="6" xl="2" md="6" sm="9" lg="4" class="rounded">
        <v-expansion-panels class="login-expansion" v-model="panel">
          <v-expand-transition>
            <ask-anna-read-more />
          </v-expand-transition>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Signin from './signin'
import Signup from './signup'
import SigninThankYou from './signin-thank-you'
import AskAnnaReadMore from '@/features/auth/components/AskAnnaReadMore'
import WaitBeforeCreateAccount from '@/features/auth/components/signup/WaitBeforeCreateAccount'
import { ref, provide, reactive, readonly, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SigninIndex',

  components: { Signin, Signup, SigninThankYou, AskAnnaReadMore, WaitBeforeCreateAccount },

  setup(_, context) {
    const { name } = context.root.$route
    const panelValue = name === 'signin' ? 0 : 1

    const signUpStep = ref(0)
    const panel = ref(panelValue)
    const authData = ref({ username: '', password: '' })

    const updateAuthData = value => (authData.value = value)
    const updateSignUpStep = value => (signUpStep.value = value)

    provide('authData', readonly(authData))
    provide('updateAuthData', updateAuthData)
    provide('signUpStep', readonly(signUpStep))
    provide('updateSignUpStep', updateSignUpStep)

    return {
      panel,
      signUpStep
    }
  }
})
</script>
