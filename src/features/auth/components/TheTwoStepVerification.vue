<template>
  <v-form ref="loginForm" v-model="isFormValid" lazy-validation @keyup.native.enter="handleLogin" @submit="handleLogin">
    <div class="mx-auto no-bg ">
      <v-subheader class="px-0">
        Two-Factor Authentication
      </v-subheader>
      <v-divider></v-divider>
      <v-text-field v-model="code" autofocus label="Code" />
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4 mt-1" @click="handleLogin">
        Verify
      </v-btn>
    </div>
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
