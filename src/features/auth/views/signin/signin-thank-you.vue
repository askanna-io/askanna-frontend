<template>
  <v-card flat class="white">
    <v-toolbar dense flat>
      <v-row no-gutters>
        <v-col cols="12" class="text-h6">Thank you for creating an account, please sign in</v-col>
      </v-row>
    </v-toolbar>
    <v-card-text>
      <the-sign-in submitButtonTitle="Sign in" />
    </v-card-text>
  </v-card>
</template>

<script>
import TheSignIn from '../../components/TheSignIn'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'signin-thank-you',

  components: {
    TheSignIn
  }
})
</script>
