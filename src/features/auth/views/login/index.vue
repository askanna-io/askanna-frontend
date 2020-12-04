<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="6" xl="2" md="4" sm="6" class="rounded">
      <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
      <v-expansion-panels readonly class="login-expansion" v-model="panel">
        <router-view />
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { ref, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Login',

  setup() {
    const panel = ref(0)
    const isLogin = ref(true)

    const handleOpenLogin = () => (isLogin.value = true)
    const handleOpenForgot = () => (isLogin.value = false)

    return {
      panel,
      isLogin,
      handleOpenLogin,
      handleOpenForgot
    }
  }
})
</script>
