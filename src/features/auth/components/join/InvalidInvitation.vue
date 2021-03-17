<template>
  <v-row align="center" justify="center">
    <v-col cols="6" xl="3" md="4" sm="6" class="rounded">
      <v-card>
        <v-card-title>Oops...something went wrong</v-card-title>
        <v-card-text class="text-body-1">
          The invitation you tried to open is not valid. Maybe the invitation is already accepted, or something else
          went wrong. An invitation is valid for 7 days. A workspace member can easily resend the invitation to you.
          <br />
          <br />
          Please check with the person who send you the invite, or send us an email on
          <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'InvalidInvitation'
})
</script>
