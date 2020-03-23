<template>
  <v-app>
    <v-content>
      <v-container fluid py-0>
        <router-view />
        <span class="version">Build version:&nbsp;{{ version }}</span>
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
  }),
  created() {
    const html = document.getElementsByTagName('html')[0]
    html.classList.add('login-layout')
  },
  beforeDestroy() {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove('login-layout')
  }
}
</script>

<style>
.login-layout .version {
  position: fixed;
  bottom: 0;
}
.login-layout {
  overflow: hidden;
}
</style>
