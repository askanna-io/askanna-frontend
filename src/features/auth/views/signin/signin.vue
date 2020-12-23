<template>
  <v-expansion-panel :key="0" active-class="colored-border" class="white">
    <v-expansion-panel-header>
      <v-row no-gutters>
        <v-col cols="12" class="text-h6">Sign in</v-col>
        <v-col cols="8" v-if="false">
          <v-fade-transition leave-absolute></v-fade-transition>
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
  name: 'Signin',

  props: {
    title: {
      type: String,
      default: () => 'Sign in'
    }
  },

  components: {
    TheSignIn,
    ForgotPasswordLink
  }
})
</script>
<style>
.login-wrapper {
  height: 100vh;
}
</style>
