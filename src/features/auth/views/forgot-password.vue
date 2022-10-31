<template>
  <AskAnnaRow justify="center" class="login-wrapper">
    <AskAnnaCol cols="6" xl="2" md="6" sm="9" lg="4" class="rounded">
      <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
      <v-expansion-panels readonly class="login-expansion" :value="0">
        <v-expansion-panel :key="0" active-class="colored-border" class="white">
          <v-expansion-panel-header hide-actions>
            <AskAnnaRow no-gutters>
              <AskAnnaCol cols="12" class="text-h6">Forgot your password?</AskAnnaCol>
              <AskAnnaCol cols="8" v-if="false">
                <v-fade-transition leave-absolute></v-fade-transition>
              </AskAnnaCol>
            </AskAnnaRow>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <SignInForgotPasswordSentForm />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </AskAnnaCol>
  </AskAnnaRow>
</template>

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
