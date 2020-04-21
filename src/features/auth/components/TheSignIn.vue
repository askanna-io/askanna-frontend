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
      <v-checkbox v-if="isNotBeta" dense label="Remember me" />
    </v-form>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useAuthStore from '../composition/useAuthStore'

export default defineComponent({
  name: 'TheSignIn',

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

      this.login({ ...this.formData })
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
