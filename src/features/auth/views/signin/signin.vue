<template>
  <v-expansion-panel :key="0" active-class="colored-border" class="white">
    <v-expansion-panel-header>
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="text-h6">Sign in</AskAnnaCol>
        <AskAnnaCol cols="8" v-if="false">
          <v-fade-transition leave-absolute></v-fade-transition>
        </AskAnnaCol>
      </AskAnnaRow>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <SignIn />
      <SignInForgotPasswordLink />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<style>
.login-wrapper {
  height: 100vh;
}
</style>
