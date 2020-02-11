<template>
  <v-card dark width="100%" class="mx-auto no-bg ">
    <v-card-actions>
      <v-btn class="ma-2"><v-icon dark>mdi-google</v-icon> Google </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-checkbox label="Remember me" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TheSignInGoogle'
}
</script>
