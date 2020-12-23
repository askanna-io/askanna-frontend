<template>
  <v-app>
    <v-main class="login-layout">
      <v-container fluid pa-0>
        <router-view />
        <span v-if="isNotBeta" class="version">Build version:&nbsp;{{ version }}</span>
      </v-container>
      <the-snack-bar />
    </v-main>
  </v-app>
</template>
<script>
import useTitle from '@/core/composition/useTitle'
import { onBeforeUnmount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Login',

  setup(props, context) {
    useTitle(context)

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
  height: 100vh;
  background-image: url('~@/assets/bg/askanna-bg-01.svg');
  background-size: cover;
  overflow: hidden;
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
