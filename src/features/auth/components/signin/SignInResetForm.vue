<template>
  <div>
    <v-form
      v-if="!isPasswordReset"
      ref="forgotPasswordSentFormRef"
      v-model="isFormValid"
      lazy-validation
      @submit.stop.prevent="handleResetPassword"
      @keyup.native.enter.prevent="handleResetPassword"
    >
      <v-text-field
        dense
        outlined
        v-model="password"
        :error-messages="error.new_password1 || error.new_password2"
        :rules="[
          RULES.required('The password is required'),
          RULES.min('The password should be longer than 10 characters', 10)
        ]"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        :type="isShowPassword ? 'text' : 'password'"
        name="input-10-1"
        label="New password"
        counter
        @click:append="isShowPassword = !isShowPassword"
      />

      <v-btn :disabled="!isFormValid" color="primary" @click.stop="handleResetPassword"> Reset password </v-btn>
    </v-form>
    <template v-else> Your password has been reset successfully! We will redirect you to the sign-in page. </template>
  </div>
</template>

<script setup lang="ts">
type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

const authStore = useAuthStore()
const { RULES } = useValidationRules()
const { route, router } = useRouterAskAnna()

const { token, uid } = route.query

let error = reactive({
  new_password1: '',
  new_password2: ''
})
const password = ref('')

const isFormValid = ref(false)
const isShowPassword = ref(false)
const isPasswordReset = ref(false)
const forgotPasswordSentFormRef = ref()

const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

const handleResetPassword = async () => {
  if (!forgotPasswordSentForm.value.validate()) {
    return
  }
  const result = await authStore.confirmResetPassword({
    uid,
    token,
    new_password1: password.value,
    new_password2: password.value
  })

  if (result && result.response && result.response.status === 400) {
    error = { ...error, ...result.response.data }

    return
  }
  isPasswordReset.value = true
  setTimeout(() => router.push({ name: 'signin' }), 3000)
}

const resetError = () => {
  error = { new_password1: '', new_password2: '' }
}
const resetValidation = () => forgotPasswordSentForm.value.resetValidation()

watch(password, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
    resetValidation()
  }
})
</script>
