<template>
  <v-app>
    <v-content>
      <v-container fluid pa-0>
        <router-view />
        <span v-if="isNotBeta" class="version">Build version:&nbsp;{{ version }}</span>
      </v-container>
      <the-snack-bar />
    </v-content>
  </v-app>
</template>
<script>
import { onBeforeUnmount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Login',

  setup() {
    const html = document.getElementsByTagName('html')[0]
    html.classList.add('login-layout')

    onBeforeUnmount(() => {
      const html = document.getElementsByTagName('html')[0]
      html.classList.remove('login-layout')
    })

    return {
      version: process.env.VERSION
    }
  }
})
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
