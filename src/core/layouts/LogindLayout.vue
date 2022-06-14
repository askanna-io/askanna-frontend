<template>
  <v-app>
    <v-main class="login-layout">
      <v-container fluid pa-0 class="login-layout--container">
        <router-view />
        <span v-if="isReview" class="version">Build version:&nbsp;{{ version }}</span>
      </v-container>
      <the-snack-bar />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import '@/core/plugins/intercom.js'
import useTitle from '@/core/composition/useTitle'
import { onUpdated, computed } from '@vue/composition-api'
import TheSnackBar from '@/core/components/snackBar/TheSnackBar.vue'

useTitle()

const version = computed(() => process.env.VERSION)

if (process.env.VUE_APP_INTERCOM === 'on') {
  window.Intercom('boot', {
    app_id: 'c6wuieqm'
  })
}

onUpdated(() => {
  if (process.env.VUE_APP_INTERCOM === 'on') {
    window.Intercom('update')
  }
})
</script>

<style>
.login-layout .version {
  position: fixed;
  bottom: 0;
}
.login-layout {
  height: 100vh;
  background-image: url('~@/assets/bg/askanna-bg-01.svg');
  background-size: cover;
  overflow: hidden;
}
.login-layout--container {
  max-width: 100%;
  overflow-x: hidden;
}

.login-layout .v-main__wrap {
  height: 100%;
  overflow-y: scroll;
}

.login-wrapper {
  height: 100vh;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.login-expansion .v-expansion-panel {
  min-width: 360px;
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
