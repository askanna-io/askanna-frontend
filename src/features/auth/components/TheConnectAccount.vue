<template>
  <v-form ref="loginForm" v-model="isFormValid" lazy-validation @keyup.native.enter="handleLogin" @submit="handleLogin">
    <v-text-field dense outlined label="Username" validate-on-blur v-model="formData.username" />
    <v-text-field
      dense
      outlined
      v-model="formData.password"
      validate-on-blur
      :type="isShowPassword ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      counter
      @click:append="isShowPassword = !isShowPassword"
    />
    <input type="password" style="display: none;" browserAutocomplete="new-password" autocomplete="new-password" />
    <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click="handleLogin">
      Sign in, connect and join
    </v-btn>
  </v-form>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useAuthStore from '../composition/useAuthStore'

export default defineComponent({
  name: 'TheConnectAccount',

  data: () => ({
    formData: {
      password: '',
      username: ''
    },
    isFormValid: false,
    isShowPassword: false
  }),

  setup(rops, context) {
    const authStore = useAuthStore()

    return {
      ...authStore
    }
  },

  methods: {
    async handleLogin() {
      if (!this.$refs.loginForm.validate()) {
        return
      }

      await this.login({ ...this.formData })
    },
    reset() {
      this.$refs.loginForm.reset()
    },
    resetValidation() {
      this.$refs.loginForm.resetValidation()
    }
  }
})
</script>
<style scoped>
.login-wrapper {
  height: 100vh;
  background: rgb(176, 132, 182);
  background: linear-gradient(0deg, rgba(176, 132, 182, 1) 7%, rgba(14, 43, 50, 1) 57%);
}
.logo {
  height: 27px;
}
</style>
