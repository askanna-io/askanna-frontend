<template>
  <div class="join-wrapper">
    <v-row align="center" justify="center">
      <v-col cols="6" xl="2" md="4" sm="6" class="rounded">
        <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
        <v-card class="pa-2 mb-2" flat> Join The AskAnna</v-card>
        <v-expansion-panels class="login-expansion" v-model="panel" mandatory>
          <v-expansion-panel :key="0" active-class="colored-border">
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="12" :class="{ 'primary--text': open }">Create a new account</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <the-create-new-account />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel :key="1" active-class="colored-border">
            <v-expansion-panel-header v-slot="{ open }">
              <v-row no-gutters>
                <v-col cols="12" :class="{ 'primary--text': open }">Connect to an existing account</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <the-connect-account />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" xl="2" md="4" sm="6" class="rounded">
        <v-card>
          <v-card-title>## What's AskAnna? </v-card-title>
          <v-card-text>
            AskAnna is the platform where you can easily collaborate on data science and machine learning projects. You
            can kickstart your next project using templates, version control, and MLOps automation tools. Also, we will
            make it easy for you to integrate with other tools. You can run everything in AskAnna using our APIs. This
            means that out of the box, you can productize your data solution, without the support of additional DevOps.
            <p>
              <a href="https://askanna.io" target="_blank">Read more about AskAnna on our website</a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, defineComponent } from '@vue/composition-api'
import TheConnectAccount from '../components/TheConnectAccount'
import TheCreateNewAccount from '../components/TheCreateNewAccount'

export default defineComponent({
  name: 'TheJoin',

  components: {
    TheConnectAccount,
    TheCreateNewAccount
  },

  setup() {
    const panel = ref(0)

    return {
      panel
    }
  }
})
</script>
<style scoped>
.join-wrapper {
  height: 100vh;
  background-image: url('~@/assets/bg/askanna-bg-01.svg');
  background-size: cover;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.login-expansion .v-expansion-panel {
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
