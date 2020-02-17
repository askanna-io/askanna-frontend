<template>
  <div>
    <v-form
      v-if="!isSuccesLogedIn"
      ref="loginForm"
      v-model="isFormValid"
      lazy-validation
      @keyup.native.enter="handleLogin"
      @submit="handleLogin"
    >
      <v-text-field
        v-model="formData.username"
        validate-on-blur
        autofocus
        autocomplete="off"
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
      />
      <input type="password" style="display:none" browserAutocomplete="new-password" autocomplete="new-password" />
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click="handleLogin">
        Sign in
      </v-btn>
      <v-checkbox dense label="Remember me" />
    </v-form>

    <v-slide-y-transition>
      <the-two-step-verification v-if="isSuccesLogedIn" />
    </v-slide-y-transition>
    <the-sign-in-google v-if="!isSuccesLogedIn" />
  </div>
</template>

<script>
import TheTwoStepVerification from './TheTwoStepVerification'

import { createNamespacedHelpers } from 'vuex'
import { login } from '@/core/store/actionTypes'
import { AUTH_STORE } from '@/core/store/storeTypes'
import TheSignInGoogle from '../components/TheSignInGoogle'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)

export default {
  name: 'TheSignIn',

  components: { TheSignInGoogle, TheTwoStepVerification },

  data: () => ({
    expand: false,
    formData: {
      password: '',
      username: ''
    },
    isFormValid: false,
    isShowPassword: false,
    isSuccesLogedIn: false
  }),

  methods: {
    ...mapActions({
      login
    }),
    async handleLogin() {
      if (!this.$refs.loginForm.validate()) {
        return
      }

      const isSuccesLogedIn = await this.login({ ...this.formData })
      if (isSuccesLogedIn && isSuccesLogedIn.key) {
        this.isSuccesLogedIn = true
      }
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
