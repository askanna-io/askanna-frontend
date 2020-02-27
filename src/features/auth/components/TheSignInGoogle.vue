<template>
  <div class="mx-auto no-bg ">
    <v-subheader>
      Sign in via google
    </v-subheader>
    <v-divider></v-divider>
    <v-btn color="grey lighten-1" class="my-2"><v-icon>$google</v-icon> Google </v-btn>
    <v-checkbox dense label="Remember me" />
  </div>
</template>

<script>
export default {
  name: 'TheSignInGoogle'
}
</script>
