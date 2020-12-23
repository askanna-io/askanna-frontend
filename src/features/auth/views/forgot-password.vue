<template>
  <v-row justify="center" class="login-wrapper">
    <v-col cols="6" xl="2" md="6" sm="9" lg="4" class="rounded">
      <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
      <v-expansion-panels readonly class="login-expansion" v-model="panel">
        <v-expansion-panel :key="0" active-class="colored-border" class="white">
          <v-expansion-panel-header hide-actions>
            <v-row no-gutters>
              <v-col cols="12" class="text-h6">Forgot your password?</v-col>
              <v-col cols="8" v-if="false">
                <v-fade-transition leave-absolute></v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <forgot-password-sent-form />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { ref, defineComponent } from '@vue/composition-api'
import ForgotPasswordSentForm from '../components/account/ForgotPasswordSentForm'

export default defineComponent({
  name: 'forgot-password',

  components: {
    ForgotPasswordSentForm
  },

  setup() {
    const panel = ref(0)

    return {
      panel
    }
  }
})
</script>
<style>
.login-wrapper {
  height: 100vh;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.colored-border {
  border: 1px solid;
}
</style>
