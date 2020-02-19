<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <router-view />
        <span>Build version:&nbsp;{{ version }}</span>
      </v-container>
      <the-snack-bar />
    </v-content>
  </v-app>
</template>
<script>
export default {
  name: 'Login',

  data: () => ({
    version: process.env.VERSION
  })
}
</script>
