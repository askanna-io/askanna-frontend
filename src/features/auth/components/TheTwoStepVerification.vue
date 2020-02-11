<template>
  <v-form ref="loginForm" v-model="isFormValid" lazy-validation @keyup.native.enter="handleLogin" @submit="handleLogin">
    <v-card class="no-bg">
      <v-card-title>Two-Factor Authentication</v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-card-text>
        <v-text-field v-model="code" label="Two-factor authentication code" :hint="hintMessage" />
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click="handleLogin">
          Verify
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: 'TheSignIn',

  data: () => ({
    hintMessage: `Enter the code from the two-factor app on your mobile device. If you've lost your device, you may enter one of
        your recovery codes.`,
    code: '',
    isFormValid: false
  }),

  methods: {
    async handleLogin() {
      if (!this.code) {
        return
      }

      this.$router.push({ path: '/' })
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
.no-bg {
  background: none;
}
</style>