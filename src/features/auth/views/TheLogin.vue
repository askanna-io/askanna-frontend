<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="6" xl="2" md="3" sm="5">
      <img alt="AskAnna logo" src="@/assets/logo.png" class="logo" />
      <v-form
        ref="loginForm"
        v-model="isFormValid"
        lazy-validation
        @keyup.native.enter="handleLogin"
        @submit="handleLogin"
      >
        <v-text-field
          v-model="formData.username"
          dark
          :rules="[RULE.min('Must be at least 3 characters long', 3), RULE.required('Username is required')]"
          label="Username"
          required
        />
        <v-text-field
          v-model="formData.password"
          dark
          :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
          :rules="[RULE.min('Must be at least 8 characters long', 8), RULE.required('Username is required')]"
          :type="isShowPassword ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          counter
          @click:append="isShowPassword = !isShowPassword"
        ></v-text-field>
        <input type="password" style="display:none" browserAutocomplete="new-password" autocomplete="new-password" />
        <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click="handleLogin">
          Login
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { login } from '@/core/store/actionTypes'
import { AUTH_STORE } from '@/core/store/storeTypes'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)

export default {
  name: 'Login',

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
