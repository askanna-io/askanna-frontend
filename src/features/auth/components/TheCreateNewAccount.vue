<template>
  <v-form ref="loginForm" v-model="isFormValid" lazy-validation @keyup.native.enter="handleLogin" @submit="handleLogin">
    <v-card flat class="text-left position">
      <v-container pa-0 pb-2 class="avatar--wrapper">
        <v-row>
          <v-col class="pt-2 pb-0" cols="2" align-self="center">
            <v-avatar rounded="21" :size="false ? 150 : 50" tile>
              <v-img v-if="false" class="img--rounded" :src="'/'" />
              <v-icon v-else size="55">mdi-account-outline</v-icon>
            </v-avatar>
          </v-col>
          <v-col class="pt-2 pb-0" align-self="center">
            Add your photo
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-text-field dense outlined label="Name" validate-on-blur v-model="formData.username" />
    <v-text-field dense outlined label="Email address" validate-on-blur v-model="formData.username" />
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
      Create account and join
    </v-btn>
  </v-form>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useAuthStore from '../composition/useAuthStore'

export default defineComponent({
  name: 'TheCreateNewAccount',

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
