<template>
  <v-expansion-panel :key="1" active-class="colored-border" class="white">
    <v-expansion-panel-header>
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="text-h6">Create a new account</AskAnnaCol>
        <AskAnnaCol cols="8" v-if="false">
          <v-fade-transition leave-absolute></v-fade-transition>
        </AskAnnaCol>
      </AskAnnaRow>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <SignUp />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
