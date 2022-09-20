<template>
  <v-row align="center" justify="center">
    <v-col cols="6" xl="6" md="4" sm="6" class="rounded pt-1">
      <v-card>
        <v-card-title>Oops...something went wrong</v-card-title>
        <v-card-text class="text-body-1">
          The reset password link you tried to open is not valid. Maybe the token is already used, or something else
          went wrong.
          <br />
          <br />
          Please try to
          <router-link :to="{ name: 'forgot-password' }" class="ask-anna-link">reset your password</router-link>
          again, or send us an email on <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
