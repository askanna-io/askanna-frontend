<template>
  <v-expansion-panel :key="0" active-class="colored-border" class="white">
    <v-expansion-panel-header hide-actions>
      <v-row no-gutters>
        <v-col cols="12" class="text-h6">Log in to AskAnna</v-col>
        <v-col cols="8" v-if="false">
          <v-fade-transition leave-absolute> </v-fade-transition>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <the-sign-in />
      <forgot-password-link />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import TheSignIn from '../../components/TheSignIn'
import { ref, defineComponent } from '@vue/composition-api'
import ForgotPasswordLink from '../../components/account/ForgotPasswordLink'

export default defineComponent({
  name: 'Login',

  components: {
    TheSignIn,
    ForgotPasswordLink
  },

  setup() {
    const handleOpenLogin = () => (isLogin.value = true)
    const handleOpenForgot = () => (isLogin.value = false)

    return {
      handleOpenLogin,
      handleOpenForgot
    }
  }
})
</script>
<style>
.login-wrapper {
  height: 100vh;
}
</style>
