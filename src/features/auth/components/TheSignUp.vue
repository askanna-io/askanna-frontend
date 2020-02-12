<template>
  <v-form ref="loginForm" v-model="isFormValid" lazy-validation @keyup.native.enter="handleLogin" @submit="handleLogin">
    <v-text-field label="Email address" v-model="formData.username"></v-text-field>
    <v-text-field
      v-model="formData.password"
      dark
      :rules="[RULE.min('Must be at least 8 characters long', 8), RULE.required('Email is required')]"
      :type="isShowPassword ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      counter
      @click:append="isShowPassword = !isShowPassword"
    />
    <input type="password" style="display:none" browserAutocomplete="new-password" autocomplete="new-password" />
    <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click="handleLogin">
      Sign up
    </v-btn>
  </v-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { login } from '@/core/store/actionTypes'
import { AUTH_STORE } from '@/core/store/storeTypes'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)

export default {
  name: 'TheSignIn',

  data: () => ({
    formData: {
      password: '',
      username: ''
    },
    isFormValid: false,
    isShowPassword: false
  }),

  methods: {
    ...mapActions({
      login
    }),
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
}
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
