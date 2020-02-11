<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="6" xl="2" md="4" sm="6">
      <img alt="AskAnna logo" src="@/assets/logo.png" class="logo" />
      <v-expansion-panels flat dark class="lodin-expansion" v-model="panel">
        <v-expansion-panel :key="0" active-class="colored-border">
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4" :class="{ 'primary--text': open }">Sign in</v-col>
              <v-col cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="open" key="0">
                    Please fill fields
                  </span>
                  <span v-else key="1"></span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <the-sign-in />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel :key="1" active-class="colored-border">
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4" :class="{ 'primary--text': open }">Sign in via google</v-col>
              <v-col cols="8"> </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <the-sign-in-google />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel :key="2" active-class="colored-border">
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="4" :class="{ 'primary--text': open }">Sign up</v-col>
              <v-col cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="open" key="0">
                    Create new user
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <the-sign-up />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import TheSignUp from '../components/TheSignUp'
import TheSignIn from '../components/TheSignIn'
import TheSignInGoogle from '../components/TheSignInGoogle'

export default {
  name: 'Login',

  components: {
    TheSignIn,
    TheSignUp,
    TheSignInGoogle
  },

  data: () => ({
    panel: 0
  }),

  methods: {}
}
</script>
<style scoped>
.login-wrapper {
  height: 100vh;
  background: rgb(176, 132, 182);
  background: linear-gradient(0deg, rgba(176, 132, 182, 1) 7%, rgba(14, 43, 50, 1) 57%);
}
.logo {
  height: 27px;
  padding-left: 10px;
  margin-bottom: 6px;
}
.lodin-expansion .v-expansion-panel {
  background: transparent;
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
