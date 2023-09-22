<template>
  <VForm
    v-if="!isPasswordReset"
    @submit.prevent
    v-model="isFormValid"
    ref="forgotPasswordSentFormRef"
    @submit.stop.prevent="handleResetPassword"
    @keyup.enter.prevent="handleResetPassword"
  >
    <AskAnnaTextField
      counter
      v-model="password"
      validate-on="blur"
      label="New password"
      :type="isShowPassword ? 'text' : 'password'"
      :error-messages="error.new_password1 || error.new_password2"
      :rules="[
          RULES.required('The password is required'),
          RULES.min('The password should be longer than 10 characters', 10)
        ]"
      :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isShowPassword = !isShowPassword"
    />

    <AskAnnaButton
      type="submit"
      size="default"
      color="primary"
      variant="elevated"
      @click.stop="handleResetPassword"
    >
      Reset password
    </AskAnnaButton>
  </VForm>
  <template v-else>Your password has been reset successfully! We will redirect you to the sign-in page. </template>
</template>

<script setup lang="ts">
type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

const authStore = useAuthStore()
const { RULES } = useValidationRules()
const { route, routerPush } = useRouterAskAnna()

const { token, uid } = route.query

let error = reactive({
  new_password1: '',
  new_password2: ''
})
const password = ref('')
const isFormValid = ref(true)
const isShowPassword = ref(false)
const isPasswordReset = ref(false)
const forgotPasswordSentFormRef = ref()

const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

const handleResetPassword = async () => {
  if (!forgotPasswordSentForm.value.validate()) {
    isFormValid.value = false
    return
  }
  const result = await authStore.confirmResetPassword({
    uid,
    token,
    new_password1: password.value,
    new_password2: password.value
  })

  if (result && result.response && result.response.status === 400) {
    Object.assign(error, result.response.data)

    return
  }
  isPasswordReset.value = true
  setTimeout(() => routerPush({ name: 'signin' }), 3000)
}

const resetError = () => Object.assign(error, { new_password1: '', new_password2: '' })

watch(password, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
  }
})
</script>