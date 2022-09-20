<template>
  <v-expansion-panel :key="1" active-class="colored-border" class="white">
    <v-expansion-panel-header>
      <v-row no-gutters>
        <v-col cols="12" class="text-h6">Create a new account</v-col>
        <v-col cols="8" v-if="false">
          <v-fade-transition leave-absolute></v-fade-transition>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <SignUp />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
