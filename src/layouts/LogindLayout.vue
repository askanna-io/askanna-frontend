<template>
  <v-app>
    <v-main class="login-layout">
      <AskAnnaContainer fluid pa-0 class="login-layout--container">
        <RouterView />
      </AskAnnaContainer>
      <the-snack-bar />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
if (import.meta.env.VITE_APP_INTERCOM_ID) {
  window.Intercom('boot', {
    app_id: import.meta.env.VITE_APP_INTERCOM_ID
  })
}

onUpdated(() => {
  if (import.meta.env.VITE_APP_INTERCOM_ID) {
    window.Intercom('update')
  }
})
</script>

<style>
.login-layout .version {
  bottom: 0;
  position: fixed;
}

.login-layout {
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-image: url('/assets/bg/askanna-bg-01.svg');
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
</style>
