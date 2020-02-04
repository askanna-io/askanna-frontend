<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
      <the-snack-bar />
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Login'
}
</script>
